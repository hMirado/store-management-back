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
import { createAttribute } from '../services/attribute.service';
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
  const shopUuid: string = req.query.shop as string
  try {
    const shop = await getShopByUuid(shopUuid);
    if (!shop) return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Shop inexistant.'});
    
    const stock = await getProductsInStock(shopUuid);
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

const sequelize = require("../config/db.config");
export const createOrUpdateStockHandler = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();
  var newStock: any = {};
  const attributes = req.body.attributes;
  try {
    const shop = await getShopByUuid(req.params.shop);
    if (!shop) return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Shop inexistant.'});

    const product = await getProductById(req.body.fk_product_id);
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
    for (const attribute of attributes) {
      const data: typeof model.Attribute = {
        camera: attribute.camera,
        graphics_card: attribute.graphics_card,
        processor: attribute.processor,
        ram: attribute.ram,
        storage: attribute.storage,
        storage_type: attribute.storage_type,
        fk_product_id: product.product_id
      }
      const attributeCreated = await createAttribute(data, transaction);
      const serialization = attribute.serialization.map((x: any)=> {
        return {
          serialization_value: x.value,
          fk_serialization_type_id: x.type,
          fk_product_id: product.product_id,
          fk_attribute_id: attributeCreated.attribute_id
        }
      });
      const serializationCreated = await createMultipleSerialization(serialization, transaction);
      newAttributes.push({attribute: attributeCreated, serialization: serializationCreated});
    }
    newStock.detail = newAttributes;
    await transaction.commit();
    return await res.status(200).json({status: 200, data: newStock, notification: "Stock et detail de l'article ajoutés"})
  } catch (error) {
    console.error(error)
    await transaction.rollback();
    return res.status(500).json({ error: error, notification: "Erreur système" });
  }
}