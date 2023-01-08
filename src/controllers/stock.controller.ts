import { Request, Response } from "express";
import { 
  getProductsInStock, 
  getStock, 
  getStockById, 
  createStock, 
  editStock, 
  createStockMovment 
} from '../services/stock.service'
import { getShopByUuid } from '../services/shop.service'
import { getStockMovmentTypeByMovment } from '../services/stock-movment-type.service'
import { getProductByUuid, getProductById } from "../services/product.service";
import { createMultipleSerialization } from '../services/serialization.service';
import { createMultipleAttribute } from '../services/attribute.service';
const sequelize = require("../config/db.config");
const model = require("../models/index");

module.exports.addStock = async (req: Request, res: Response) => {
  try {
    const stock = ['addStock(req)'];
    return res.status(200).json({status: 200, data: stock, notification: 'Stock importées avec succès'});
  } catch (error) {
    return res
			.status(500)
			.json({ error: error, notification: "Erreur système" });
  }
}

// export const importStockHandler = async (req: Request, res: Response) => {
//   try {
//     const shop = await getShopByUuid(req.params.shop);
//     if (!shop) return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Shop inexistant.'});
    
//     const movment = await getStockMovmentTypeByMovment('IN');

//     await importStock(req, shop.shop_id, movment.stock_movment_type_id);
//     return res.status(200).json({status: 200, data: {imported: true}, notification: 'Stock importées avec succès'});
//   } catch (error: any) {
//     return res
// 			.status(500)
// 			.json({ error: error, notification: "Erreur système" });
//   }
// }

export const getProductsInStockHandler = async (req: Request, res: Response) => {
  const shopUuid: string = req.params.shop
  try {
    const shop = await getShopByUuid(shopUuid);
    if (!shop) return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Shop inexistant.'});
    
    const stock = await getProductsInStock(req, shopUuid);
    return await res.status(200).json({status: 200, data: stock, notification: 'Liste des stocks récupérés.'})
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({ error: error, notification: "Erreur système" });
  }
}

export const qetStockHandler = async (req: Request, res: Response) => {
  const shopUuid: string = req.query.shop as string;
  const productUuid: string = req.query.product as string;
  try {
    const shop = await getShopByUuid(shopUuid);
    if (!shop) return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Shop inexistant.'});

    const product = await getProductByUuid(productUuid);
    if (!product) return res.status(400).json({status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Produit inéxitant'});
     
    const stock = await getStock(shopUuid, productUuid);
    return await res.status(200).json({status: 200, data: stock, notification: 'Liste des stocks récupérés.'})
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({ error: error, notification: "Erreur système" });
  }
}

export const createOrUpdateStockHandler = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();
  var newStock: any = {};
  const details = req.body.details;
  const productId = req.body.item
  const random: number = Date.now();
  try {
    const shop = await getShopByUuid(req.params.shop);
    if (!shop) return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Shop inexistant.'});

    const product = await getProductById(productId);
    if (!product) return res.status(400).json({status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Produit inéxitant'});
    const stockMovmentType = await getStockMovmentTypeByMovment('IN');
    const stock = await getStockById(shop.shop_id, product.product_id);
    if (stock && stock.stock_id) {
      const edit: typeof model.Stock = await editStock(req.body.quantity + stock.quantity, stock.stock_id, transaction);
      newStock.stock = edit;
    } else {
      const value: typeof model.Stock = {
        quantity: req.body.quantity,
        fk_stock_movment_type_id: stockMovmentType.stock_movment_type_id,
        fk_shop_id: shop.shop_id,
        fk_product_id: product.product_id
      }
      const add: typeof model.Stock = await createStock(value, transaction);
      newStock.stock = add;
    }

    const value = [{
      quantity: req.body.quantity,
      fk_stock_movment_type_id:  stockMovmentType.stock_movment_type_id,
      fk_shop_id: shop.shop_id,
      fk_product_id: product.product_id
    }]
    const movment: typeof model.StockMovment = await createStockMovment(value, transaction)
    newStock.movment = movment;

    const newAttributes: any[] = [];
    for (const detail of details) {
      const attributes = detail.attributes.map((value: any) => {
        return {
          fk_product_id: product.product_id,
          attribute: value.attribute,
          attribute_serialization: `${random}${value.id}`,
          fk_attribute_type_id: value.attribute_type
        }
      });

      const attributeCreated = await createMultipleAttribute(attributes, transaction);

      const serializations = detail.serializations.map((value: any)=> {
        return {
          serialization_value: value.value,
          attribute_serialization:`${random}${value.id}`,
          fk_serialization_type_id: value.type,
          fk_product_id: product.product_id,
          fk_shop_id: shop.shop_id
        }
      });
      const serializationCreated = await createMultipleSerialization(serializations, transaction);
      newAttributes.push({attribute: attributeCreated, serialization: serializationCreated});
    }
    newStock.detail = newAttributes;
    await transaction.commit();
    return await res.status(201).json({status: 201, data: newStock, notification: "Stock et detail de l'article ajoutés"})
  } catch (error) {
    console.error(error)
    await transaction.rollback();
    return res.status(500).json({ error: error, notification: "Erreur système" });
  }
}