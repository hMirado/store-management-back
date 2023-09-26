import { Request, Response } from "express";
import { 
  getProductsInStock, 
  getStock, 
  getStockById, 
  createStock, 
  editStock, 
  createStockMovment,
  countProductInStock,
  countProductOutStock,
  addStock,
  getStockByProductShop,
  importStock
} from '../services/stock.service'
import { getShopByUuidOrCode } from '../services/shop.service'
import { getStockMovmentTypeByMovment } from '../services/stock-movment-type.service'
import { getProductByUuid, getProductById } from "../services/product.service";
import { createMultipleSerialization } from '../services/serialization.service';
import { createMultipleAttribute } from '../services/attribute.service';
import { createPrice } from '../services/price.service';
import { ADMIN } from "../config/constants";
const sequelize = require("../config/db.config");
const model = require("../models/index");

export const getProductsInStockHandler = async (req: Request, res: Response) => {
  let shopUuid: string|null = req.query.shop ? req.query.shop as string : null
  try {
    const tokenData = res.locals.user
    if (tokenData.role.role_key != ADMIN) {
      shopUuid = tokenData.shops[0].shop_uuid
    }
    if (shopUuid) {
      const shop = await getShopByUuidOrCode(shopUuid);
      if (!shop) return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Shop inexistant.'});
    }
    
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
    const shop = await getShopByUuidOrCode(shopUuid);
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
  const productPrice = req.body?.price;
  const productId = req.body.item
  const random: number = Date.now();
  try {
    const shop: typeof model.Shop = await getShopByUuidOrCode(req.params.shop);
    if (!shop) return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Shop inexistant.'});

    const product: typeof model.Product = await getProductById(productId);
    if (!product) return res.status(400).json({status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Produit inéxitant'});
    
    const stockMovmentType = await getStockMovmentTypeByMovment('IN-IMPORT');
    
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

    if (!product.is_serializable) {
      if (!productPrice) return res.status(400).json({status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Prix non renseigné'});
      // On multiple par 100 pour enlever les virgules
      const ttcPrice = productPrice * 100;
      const htPrice = ttcPrice * 0.8;
      const price: typeof model.Price = {
        fk_product_id: product.product_id,
        ttc_price: ttcPrice,
        ht_price: htPrice
      }
      const priceCreated = await createPrice(price, transaction);
      newStock.price = priceCreated;
    } else {
      const newAttributes: any[] = [];
      for (const detail of details) {
        // On multiple par 100 pour enlever les virgules
        const ttcPrice = detail.price * 100;
        const htPrice = ttcPrice * 0.8;
        const price: typeof model.Price = {
          fk_product_id: product.product_id,
          ttc_price: ttcPrice,
          ht_price: htPrice
        }
        const priceCreated = await createPrice(price, transaction)
  
        const attributes = detail.attributes.map((value: any) => {
          return {
            fk_product_id: product.product_id,
            attribute: value.attribute,
            attribute_serialization: `${random}${value.id}`,
            fk_attribute_type_id: value.attribute_type,
            fk_price_id: priceCreated.price_id
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
        newAttributes.push({price: priceCreated, attribute: attributeCreated, serialization: serializationCreated});
      }
      newStock.detail = newAttributes;
    }
    await transaction.commit();
    return await res.status(201).json({status: 201, data: newStock, notification: "Stock et detail de l'article ajoutés"})
  } catch (error: any) {
    console.error(error)
    await transaction.rollback();
    return res.status(500).json({ error: error, notification: "Erreur système" });
  }
}

export const countStock = async (req: Request, res: Response) => {
  let shopUuid: string|null = req.query.shop ? req.query.shop as string : null;
  let shopId: number|null = null;
  try {
    
    if (shopUuid) {
      const shop: typeof model.Shop = await getShopByUuidOrCode(shopUuid);
      if (!shop) return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Shop inexistant.'});
      shopId = shop.shop_id;
    }

    const tokenData = res.locals.user
    if (tokenData.role.role_key != ADMIN) {
      shopId = tokenData.shops[0].shop_id
    }

    const inStock = await countProductInStock(shopId);
    const outStock = await countProductOutStock(shopId);

    const result = {
      in: inStock,
      out: outStock
    }

    return await res.status(200).json({status: 200, data: result, notification: "Total des stocks"});
  } catch (error: any) {
    console.error("\nstock.controller::countStock", error)
    return await res.status(500).json({ error: error, notification: "Erreur système" });
  }
}

export const addStockStockHandler = async (req: Request, res: Response) => {
  try {
    const _product = await getProductByUuid(req.body.product);
    if (!_product) return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Article inconnu.'});

    const _shop = await getShopByUuidOrCode(req.body.shop);
    if (!_shop) return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Shop inexistant.'});

    const _stock = await getStockById(_shop.shop_id, _product.product_id);
    const existedStock = {
      isExist: _stock ? true: false,
      stockId: _stock ? _stock.stock_id : null,
      quantity: _stock ? +_stock.quantity : null
    }
    const stock = await addStock(_product, _shop.shop_id, _product.is_serializable, existedStock, req );

    return await res.status(201).json({status: 201, data: stock, notification: "Stocks d'article ajoutés"})
  } catch (error: any) {
    console.error("\nstock.controller::createStockHandler", error)
    return await res.status(500).json({ error: error, notification: "Erreur système" });
  }
}

export const getStockByProductShopHandler = async (req: Request, res: Response) => {
  try {
    const shop: typeof model.Shop = await getShopByUuidOrCode(req.params.shop);
    if (!shop) return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Shop inexistant.'});

    const product: typeof model.Product = await getProductByUuid(req.params.product);
    if (!product) return res.status(400).json({status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Produit inéxitant'});
    
    const stock: typeof model.Stock = await getStockByProductShop(product.product_id, shop.shop_id);
    return await res.status(200).json({status: 200, data: stock, notification: "Stock retourné."})
  } catch (error: any) {
    console.error("stock.controller::getStockByProductShopHandler", error)
    return await res.status(500).json({ error: error, notification: "Erreur système" });
  }
}

export const importStokHandler = async (req: Request, res: Response) => {
  try {
    const file = req.body.file;
		if (!file.includes("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,")) 
			return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Format invalide. Le fichier n\'est pas de format XLS/XLSX.'});
    const response = await importStock(file);
    return await res.status(200).json({status: 200, data: response, notification: "Stock retourné."})
  } catch (error: any) {
    console.error("stock.controller::importStokHandler", error);
    return await res.status(500).json({ error: error, notification: "Erreur système" });
  }
}