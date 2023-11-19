import { Request, Response } from "express";
import { getShopByUuidOrCode } from "../services/shop.service";
import { sell, getSelled, countSale, getSaleGraphData, getSaleCompareData, getTodayTotalSale } from "../services/sale.service";
import { findUserByUuid } from "../services/user.service";
import { getProductByUuid } from "../services/product.service";
import { getSerializationByGroup } from "../services/serialization.service";
import { getProductStockQuantity } from "../services/stock.service";
import { ADMIN } from "../config/constants";
const model = require("../models/index");

export const sellHandler = async (req: Request, res: Response) => {
  try {
    const shop: typeof model.shop = await getShopByUuidOrCode(req.body.shop);
    if (!shop) return res.status(400).json({ status: 400, error: 'Ressource non trouvée', notification: 'Shop inexistante.'});

    const user: typeof model.User = await findUserByUuid(req.body.user);
    if (!user) return res.status(400).json({ status: 400, error: 'Ressource non trouvée', notification: 'Utilisateur inexistante.'});

    const product: typeof model.Product = await getProductByUuid(req.body.product);
    if (!product) return res.status(400).json({ status: 400, error: 'Ressource non trouvée', notification: 'Produit inexistante.'});

    let serialization = null;
    if (product.is_serializable && req.body.serialization && req.body.serialization != '') {
      const _serialization: typeof model.serialization = await getSerializationByGroup(req.body.serialization);
      if (!_serialization || (_serialization.fk_product_id != product.product_id) || (_serialization.fk_shop_id != shop.shop_id)) 
        return res.status(400).json({ status: 400, error: 'Ressource non trouvée', notification: 'Serialization inexistante.'});
      else if (_serialization && (_serialization.is_sold || _serialization.is_in_transfer))
        return res.status(400).json({ status: 400, error: 'Ressource non trouvée', notification: 'Serialization déja vendu ou en cours de transfert.'});
      else 
        serialization = _serialization.group_id;
    }

    const quantity = req.body.quantity ? req.body.quantity : 1;
    if (!product.is_serializable) {
      const stock = await getProductStockQuantity(product.product_id, shop.shop_id);
      if (quantity > stock.quantity) return res.status(400).json({ status: 400, error: 'Ressource non trouvée', notification: 'Quantité en stock insuffisante.'});
    }
    
    const sold = await sell(shop.shop_id, user.user_id, product.product_id, serialization, req.body.price, quantity);
    return res.status(201).json({status: 201, data: sold, notification: 'Article vendu'});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error, notification: 'Erreur système'});
  }
}

export const getSelledHandler = async (req: Request, res: Response) => {
  try {
    const products = await getSelled(req);
    return res.status(200).json({status: 200, data: products, notification: 'Article vendu'});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error, notification: 'Erreur système'});
  }
}

export const countSaleHandler = async (req: Request, res: Response) => {
  try {
    let shopId: number | null = null
    if (req.params.uuid) {
      const shop: typeof model.shop = await getShopByUuidOrCode(req.params.uuid);
      if (!shop) return res.status(400).json({ status: 400, error: 'Ressource non trouvée', notification: 'Shop inexistante.'});
      else shopId = shop.shop_id;
    }

    const total = await countSale(shopId);
    return res.status(200).json({status: 200, data: total, notification: 'Statistique'});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error, notification: 'Erreur système'});
  }
}

export const getSaleGraphDataHandler = async (req: Request, res: Response) => {
  try {
    const tokenData = res.locals.user
    let shopId: number|null = (tokenData.role.role_key != ADMIN) ? tokenData.shops[0].shop_id : null;
    if (req.query.shop && shopId == null) {      
      const shop: typeof model.shop = await getShopByUuidOrCode(req.query.shop as string);
      if (!shop) return res.status(400).json({ status: 400, error: 'Ressource non trouvée', notification: 'Shop inexistante.'});
    }
    const data: any = await getSaleGraphData(req, shopId);
    return res.status(200).json({status: 200, data, notification: 'Données du graphe'});
  } catch (error: any) {
    process.stderr.write("sale.controller/getSaleGraphDataHandler : " + error.toString())
    return res.status(500).json({ error: error.toString(), notification: 'Erreur système'});
  }
}

export const getSaleCompareDataHandler = async (req: Request, res: Response) => {
  try {
    const tokenData = res.locals.user
    let shopId: number|null = (tokenData.role.role_key != ADMIN) ? tokenData.shops[0].shop_id : null;
    
    const data: any = await getSaleCompareData(req, shopId);
    return res.status(200).json({status: 200, data, notification: 'Données du graphe'});
  } catch (error: any) {
    process.stderr.write("sale.controller/getSaleGraphDataHandler : " + error.toString())
    return res.status(500).json({ error: error.toString(), notification: 'Erreur système'});
  }
}

export const getTodayTotalSaleHandler = async (req: Request, res: Response) => {
  try {
    const tokenData = res.locals.user
    let shopId: number|null = (tokenData.role.role_key != ADMIN) ? tokenData.shops[0].shop_id : null;
    
    const data: any = await getTodayTotalSale(shopId);
    return res.status(200).json({status: 200, data, notification: 'Données du graphe'});
  } catch (error: any) {
    process.stderr.write("sale.controller/getSaleGraphDataHandler : " + error.toString())
    return res.status(500).json({ error: error.toString(), notification: 'Erreur système'});
  }
}