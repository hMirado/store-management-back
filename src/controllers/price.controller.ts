const model = require("../models/index");
import { Request, Response } from "express";
import { getPrice } from '../services/price.service';
import { getProductByUuid } from "../services/product.service";

export const getPriceHandler = async (req: Request, res: Response) => {
  const shop = req.query.shop as string || '';
  try {
    const product = await getProductByUuid(req.params.product);
    if (!product) return res.status(400).json({ status: 400, error: 'Ressource non trouvée', notification: 'Article inéxistant.'});

    const price = await getPrice(product.product_id, shop)
    return res.status(200).json({status: 200, data: price, notification: 'Prix de l\'article'});
  } catch (error: any) {
    console.error('price.controller::getPriceHandler', error);
    return res.status(500).json({ error: error, notification: 'Erreur système'});
  }
}