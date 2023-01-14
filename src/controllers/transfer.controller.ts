import { Request, Response } from "express";
import { getTransfertStatusByCode, createTransfer } from "../services/transfer.service";
import { getShopByUuid } from '../services/shop.service';
import { findUserByUuid } from "../services/user.service";
import { getProductByUuid } from "../services/product.service";
import { getStockMovmentTypeByMovment } from "../services/stock-movment-type.service";
import { createStockMovment, editStock, getStockById } from "../services/stock.service";
import { getAttributeSerializationBySerialization, updateSerializationShopByAttribute } from "../services/serialization.service";
const sequelize = require("../config/db.config");
const model = require("../models/index");


export const createTransferHandler = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();
  let newTransfert: any = {};
  const userSenderUuid: string = req.body.userSender;
  const userReceiverUuid: string = req.body.userReceveir;
  const shopSenderUuid: string = req.body.shopSender;
  const shopReceiverUuid: string = req.body.shopReceveir;
  const productUuid: string = req.body.product;
  const transferQuantity: number = req.body.quantity;
  const transferSerialization: any = req.body.serialization;
  try {
    const shopSender: typeof model.Shop = await getShopByUuid(shopSenderUuid);
    const shopReceiver: typeof model.Shop = await getShopByUuid(shopReceiverUuid);
    if (!shopSender || !shopReceiver) return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Un des shops est inexistant.'});

    const userSender: typeof model.User = await findUserByUuid(userSenderUuid);
    const userReceiveir: typeof model.User = await findUserByUuid(userReceiverUuid);
    if (!userSender || !userReceiveir) return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Utilisateur inexistant.'});

    const product: typeof model.Product = await getProductByUuid(productUuid);
    if (!product) return res.status(400).json({status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Produit inéxitant.'});

    if (product && product.is_serializable) {
      const serialization: typeof model.Serialization = await getAttributeSerializationBySerialization(product.product_id, transferSerialization['type'], transferSerialization['value']);
      console.log("\n\nserialization");
      console.log(serialization + "\n\n");
      
      const serializationUpdated: typeof model.Serialization = await updateSerializationShopByAttribute(serialization.attribute_serialization, shopReceiver.shop_id, transaction);
      newTransfert.serialization = serializationUpdated;
    }

    const status: typeof model.TransfertStatus = await getTransfertStatusByCode('IN_PROGRESS');
    if (!status) return res.status(400).json({status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Type de transfert inconnu.'});

    const stockMovmentType = await getStockMovmentTypeByMovment('OUT-TRANSFER');
    
    const stock = await getStockById(shopSender.shop_id, product.product_id);
    if (stock && stock.quantity >= transferQuantity) {
      const quantity = stock.quantity - transferQuantity
      const edit: typeof model.Stock = await editStock(quantity, stock.stock_id, transaction);
      newTransfert.stock = edit;
    } else {
      return res.status(400).json({status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'La quantity a tranféré est supérieure au stock disponible.'});
    }

    const movmentValue = [{
      quantity: req.body.quantity,
      fk_stock_movment_type_id:  stockMovmentType.stock_movment_type_id,
      fk_shop_id: shopSender.shop_id,
      fk_product_id: product.product_id
    }]
    const movment: typeof model.StockMovment = await createStockMovment(movmentValue, transaction)
    newTransfert.movment = movment;

    const transferValue = {
      quantity: transferQuantity,
      fk_product_id: product.product_id,
      fk_transfer_status_id: status.status_transfert_id,
      fk_user_sender: userSender.user_id,
      fk_user_receiver: userSender.user_id,
      fk_shop_sender: shopSender.shop_id,
      fk_shop_receiver: shopReceiver.shop_id,
    }

    const transferCreated: typeof model.StockTransfer = await createTransfer(transferValue, transaction);
    newTransfert.movment = transferCreated;

    await transaction.commit();
    return await res.status(201).json({status: 201, data: newTransfert, notification: "Transfert de stock crée."})
  } catch (error: any) {
    await transaction.rollback();
    console.error(error)
    return res.status(500).json({ error: error, notification: "Erreur système" });
  }
}