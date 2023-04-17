import { Request, Response } from "express";
import { getTransfertStatusByCode, createTransfer, getAllTransfer, getTransferByUuidByShop, getTransfer, updateIsInTransferSerializationTransfer, updateTransfer } from "../services/transfer.service";
import { getShopByUuid } from '../services/shop.service';
import { findUserByUuid } from "../services/user.service";
import { getProductByUuid, getProductById } from "../services/product.service";
import { getStockMovmentTypeByMovment } from "../services/stock-movment-type.service";
import { createStockMovment, createStock, editStock, getStockById } from "../services/stock.service";
import { getSerializationByProduct_Type_Value, updateSerializationTransfer } from "../services/serialization.service";
const sequelize = require("../config/db.config");
const model = require("../models/index");
import { transferStatus as status } from "../config/constants"

export const createTransferHandler = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();
  let newTransfert: any = {};
  const userSenderUuid: string = req.body.userSender;
  const userReceiverUuid: string = req.body.userReceiver;
  const shopSenderUuid: string = req.body.shopSender;
  const shopReceiverUuid: string = req.body.shopReceiver;
  const productUuid: string = req.body.product;
  const transferQuantity: number = req.body.quantity;
  const transferSerializations: [] = req.body.serialization;
  const commentary: string = req.body.commentary;
  try {
    const shopSender: typeof model.Shop = await getShopByUuid(shopSenderUuid);
    const shopReceiver: typeof model.Shop = await getShopByUuid(shopReceiverUuid);
    if (!shopSender || !shopReceiver) return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Un des shops est inexistant.'});

    const userSender: typeof model.User = await findUserByUuid(userSenderUuid);
    const userReceiver: typeof model.User = await findUserByUuid(userReceiverUuid);
    if (!userSender || !userReceiver) return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Utilisateur inexistant.'});

    const product: typeof model.Product = await getProductByUuid(productUuid);
    if (!product) return res.status(400).json({status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Produit inéxitant.'});

    const transferStatus: typeof model.TransfertStatus = await getTransfertStatusByCode('IN_PROGRESS');
    if (!transferStatus) return res.status(400).json({status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Type de transfert inconnu.'});

    const stockMovmentType = await getStockMovmentTypeByMovment('OUT-TRANSFER');
    const movmentValue = [{
      quantity: req.body.quantity,
      fk_stock_movment_type_id:  stockMovmentType.stock_movment_type_id,
      fk_shop_id: shopSender.shop_id,
      fk_product_id: product.product_id
    }]
    const movment: typeof model.StockMovment = await createStockMovment(movmentValue, transaction)
    newTransfert.movment = movment;

    const transferValue = {
      transfer_quantity: transferQuantity,
      transfer_commentary: commentary,
      fk_product_id: product.product_id,
      fk_transfer_type_id: 2,
      fk_transfer_status_id: transferStatus.transfer_status_id,
      fk_user_sender: userSender.user_id,
      fk_user_receiver: userSender.user_id,
      fk_shop_sender: shopSender.shop_id,
      fk_shop_receiver: shopReceiver.shop_id,
    }

    const transferCreated: typeof model.Transfer = await createTransfer(transferValue, transaction);
    newTransfert.transfer = transferCreated;

    const stock = await getStockById(shopSender.shop_id, product.product_id);
    if (stock && stock.quantity >= transferQuantity) {
      const quantity = stock.quantity - transferQuantity
      const edit: typeof model.Stock = await editStock(quantity, stock.stock_id, transaction);
      newTransfert.stock = edit;
    } else {
      return res.status(400).json({status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'La quantity a tranféré est supérieure au stock disponible.'});
    }

    if (product && product.is_serializable) {
      let newSerialization = [];
      for (const transferSerialization of transferSerializations) {
        const serialization: typeof model.Serialization = await getSerializationByProduct_Type_Value(product.product_id, transferSerialization['type'], transferSerialization['value']);
        const serializationUpdated: typeof model.Serialization = await updateSerializationTransfer(serialization.attribute_serialization, shopReceiver.shop_id, true, transaction);
        newSerialization.push(serializationUpdated);
      }
      newTransfert.serialization = newSerialization;
    }

    await transaction.commit();
    return await res.status(201).json({status: 201, data: newTransfert, notification: "Transfert de stock crée."})
  } catch (error: any) {
    await transaction.rollback();
    console.log(error)
    return res.status(500).json({ error: new Error(error), notification: "Erreur système" });
  }
}

export const validateTransferHandler = async (req: Request, res: Response) => {
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
    console.log(error)
    return res.status(500).json({ error: new Error(error), notification: "Erreur système" });
  }
}

export const getAllTransferHandler = async (req: Request, res: Response) => {
  try {
    const transferData: typeof model.Transfer = await getAllTransfer(req.query);
    return await res.status(200).json({status: 200, data: transferData, notification: "Liste des envois et réceptions."})
  } catch (error: any) {
    console.log(error)
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
    console.log(error)
    return res.status(500).json({ error: new Error(error), notification: "Erreur système" });
  }
}