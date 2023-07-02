import { Request, Response } from "express";
import { getShopByUuid } from "../services/shop.service";
import { sell, getSelled } from "../services/sale.service";
import { findUserByUuid } from "../services/user.service";
import { getProductByUuid } from "../services/product.service";
import { getSerializationByGroup } from "../services/serialization.service";
const model = require("../models/index");

export const sellHandler = async (req: Request, res: Response) => {
  try {
    const shop: typeof model.shop = await getShopByUuid(req.body.shop);
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
    const sold = await sell(shop.shop_id, user.user_id, product.product_id, serialization, req.body.price);
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
    
  }
}