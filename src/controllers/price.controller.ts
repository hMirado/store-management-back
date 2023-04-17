const model = require("../models/index");
import { Request, Response } from "express";
import { getPrice, updatePrice, createMuliplePrice } from '../services/price.service';
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

export const updatePriceHandler = async (req: Request, res: Response) => {
  const productUuid = req.body.product;
  let newPrice;
  try {
    const product = await getProductByUuid(productUuid);
    if (!product) return res.status(400).json({ status: 400, error: 'Ressource non trouvée', notification: 'Article inéxistant.'});
    
    const prices = req.body.prices.map((price: any) => {
      return {
        ht_price: +price.htPrice * 100,
        ttc_price: +price.ttcPrice * 100,
        fk_shop_id: price.shopId,
        fk_product_id: product.product_id
      }
    })
    const _price = await getPrice(product.product_uuid);
    if (_price.length == 0 || !_price) {
      newPrice = await createMuliplePrice(prices)
    } else {
      newPrice = await updatePrice(product.product_id, product.product_uuid, prices);
    }

    return res.status(201).json({status: 201, data: newPrice, notification: 'Prix Modifié avec succè'});
  } catch (error: any) {
    console.error('price.controller::updatePriceHandler', error);
    return res.status(500).json({ error: error, notification: 'Erreur système'});
  }
}