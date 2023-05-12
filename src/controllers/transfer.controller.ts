import { Request, Response } from "express";
import { 
  getTransfertStatusByCode, 
  getAllTransfer,
  getTransferByUuidByShop,
  getTransfer,
  updateIsInTransferSerializationTransfer,
  updateTransfer,
  addTransfer,
  getTransferByUuid
} from "../services/transfer.service";
import { getShopByUuid } from '../services/shop.service';
import { findUserByUuid } from "../services/user.service";
import { getStockMovmentTypeByMovment } from "../services/stock-movment-type.service";
import { createStockMovment, createStock, editStock, getStockById } from "../services/stock.service";
const sequelize = require("../config/db.config");
const model = require("../models/index");
import { transferStatus as status } from "../config/constants"

export const createTransferHandler = async (req: Request, res: Response) => {
  const userUuid: string = req.body.user;
  const shopSenderUuid: string = req.body.shop_sender;
  const shopReceiverUuid: string = req.body.shop_receiver;
  try {
    const shopSender: typeof model.Shop = await getShopByUuid(shopSenderUuid);
    const shopReceiver: typeof model.Shop = await getShopByUuid(shopReceiverUuid);
    if (!shopSender || !shopReceiver) return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Un des shops est inexistant.'});
    
    const user: typeof model.User = await findUserByUuid(userUuid);
    if (!user) return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Utilisateur inexistant.'});

    const newTransfert = await addTransfer(user.user_id, shopSender.shop_id, shopReceiver.shop_id, req);
    return await res.status(201).json({status: 201, data: newTransfert, notification: "Transfert d'article enregistré."})
  } catch (error: any) {
    console.log('transfer.controller::createTransferHandler',error);
    return res.status(500).json({ error: new Error(error), notification: "Erreur système" });
  }
}

export const validateTransferHandlerOld = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();
  const transferUuid: string = req.params.transfer;
  const userUuid: string = req.body.user;
  const isValidate: boolean = req.body.isValidate;
  let newTransfert: any = {};
  try {
    const transfer: typeof model.Shop = await getTransfer(transferUuid);
    if(!transfer || transfer.transfer_status.transfer_status_code != status.inProgress) {
      return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Le transfert est déja validé ou annulé, ou inconnu.'});
    }

    if (isValidate == undefined || isValidate == null) return res.status(400).json({status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Veuillez spécifier l\'action à effectuer (confirmation ou annulation) ?'});
    
    if (transfer.transfer_quantity == 0 && isValidate) return res.status(400).json({status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Impossible de valider, veuillez annuler le transfert.'});
    
    const userReceiver: typeof model.User = await findUserByUuid(userUuid);
    if (!userReceiver) return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Utilisateur inexistant.'});

    const transferStatus: typeof model.TransfertStatus = await getTransfertStatusByCode(isValidate ? 'VALIDATED' : 'CANCELLED');
    if (!transferStatus) return res.status(400).json({status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Type de transfert inconnu.'});

    const shopId = isValidate ? transfer.fk_shop_receiver : transfer.fk_shop_sender;
    const quantity = transfer.transfer_quantity
    const productId = transfer.fk_product_id;
    
    const movmentType: string = isValidate ? 'IN-TRANSFER-ACCEPTED' : 'IN-TRANSFER-CANCELLED';
    const stockMovmentType = await getStockMovmentTypeByMovment(movmentType);
    const movmentValue = [{
      quantity: quantity,
      fk_stock_movment_type_id: stockMovmentType.stock_movment_type_id,
      fk_shop_id: shopId,
      fk_product_id: productId
    }]
    const movment: typeof model.StockMovment = await createStockMovment(movmentValue, transaction)
    newTransfert.movment = movment;

    const stock = await getStockById(shopId, productId);
    if (stock && stock.stock_id) {
      const edit: typeof model.Stock = await editStock(quantity + stock.quantity, stock.stock_id, transaction);
      newTransfert.stock = edit;
    } else {
      const stockMovmentType2 = await getStockMovmentTypeByMovment('IN-IMPORT');
      const value: typeof model.Stock = {
        quantity: quantity,
        fk_stock_movment_type_id: stockMovmentType2.stock_movment_type_id,
        fk_shop_id: shopId,
        fk_product_id: productId
      }
      const add: typeof model.Stock = await createStock(value, transaction);
      newTransfert.stock = add;
    }

    if (transfer.product.is_serializable) {
      const attribute_serializations = await updateIsInTransferSerializationTransfer(shopId, productId, false, true, transaction)
      newTransfert.serialization = attribute_serializations;
    }

    const transferValue = {
      fk_user_receiver: userReceiver.user_id,
      fk_transfer_status_id: transferStatus.transfer_status_id
    }
    const editedTransfer: typeof model.Transfer = await updateTransfer(transfer.transfer_id, transferValue, transaction);
    newTransfert.transfer = editedTransfer;

    await transaction.commit();
    return await res.status(201).json({status: 200, data: newTransfert, notification: "Transfert de stock crée."})
  } catch (error: any) {
    await transaction.rollback();
    console.log("transfer.controller::validateTransferHandler",error)
    return res.status(500).json({ error: new Error(error), notification: "Erreur système" });
  }
}

export const getAllTransferHandler = async (req: Request, res: Response) => {
  try {
    const transferData: typeof model.Transfer = await getAllTransfer(req.query);
    return await res.status(200).json({status: 200, data: transferData, notification: "Liste des envois et réceptions."})
  } catch (error: any) {
    console.log("transfer.controller::getAllTransferHandler",error)
    return res.status(500).json({ error: new Error(error), notification: "Erreur système" });
  }
}

export const getTransferByUuidByShopHandler = async (req: Request, res: Response) => {
  const shopUuid: string = req.params.shop;
  const transferUuid: string = req.params.transfer;
  const inProgress: string = req.query.in_progress as string;
  try {
    const shop: typeof model.Shop = await getShopByUuid(shopUuid);
    if (!shop) return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Shop est inexistant.'});

    const transfer: typeof model.Transfer = await getTransferByUuidByShop(transferUuid, shop.shop_id, Boolean(+inProgress));
    return await res.status(200).json({status: 200, data: transfer, notification: "Détail du transfert."})
  } catch (error: any) {
    console.log("transfer.controller::getTransferByUuidByShopHandler",error)
    return res.status(500).json({ error: new Error(error), notification: "Erreur système" });
  }
}

export const getTransferByUuidHandler = async (req: Request, res: Response) => {
  const transferUuid: string = req.params.uuid;
  try {
    const transfer: typeof model.Transfer = await getTransferByUuid(transferUuid);
    return await res.status(200).json({status: 200, data: transfer, notification: "Détail du transfert."})
  } catch (error: any) {
    console.log("transfer.controller::getTransferByUuidHandler",error)
    return res.status(500).json({ error: error, notification: "Erreur système" });
  }
}

export const validateTransferHandler = async (req: Request, res: Response) => {
  const transferUuid: string = req.params.uuid;
  const userUuid: string = req.body.user;
  try {
    if (!transferUuid || !userUuid) {
      return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Veuillez renseigner tout les informations.'});
    }
    const transfer: typeof model.Transfer = await getTransferByUuid(transferUuid);
    if (!transfer || transfer.transfer_status.transfer_status_code != status.inProgress)  {
      return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Le transfert est déja validé ou inexistant.'});
    }

    const user: typeof model.User = await findUserByUuid(userUuid);
    if (!user) return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Le validateur est inexistant.'});

    const response = {
      transfer: transfer,
      user: user
    }
    return await res.status(200).json({status: 200, data: response, notification: "Détail du transfert."})
  } catch (error) {
    console.log("transfer.controller::getTransferByUuidHandler",error)
    return res.status(500).json({ error: error, notification: "Erreur système" });
  }
}