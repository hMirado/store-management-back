import { Request, Response } from "express";
import { getShopByUuid } from '../services/shop.service';
import { getProductByUuid } from "../services/product.service";
import { getSerializationByProductShop } from "../services/serialization.service";

export const getSerializationByProductShopHanlder = async (req: Request, res: Response) => {
  const shopUuid = req.query.shop as string;
  try {
    let shopId: number = 0
    if (shopUuid && shopUuid != '') {
      const shop = await getShopByUuid(req.query.shop as string);
      shopId = shop.shop_id
    }
    const product = await getProductByUuid(req.params.product);
    if (!product) return res.status(400).json({status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Produit inéxitant'});

    const result = await getSerializationByProductShop(product.product_id, shopId);
    return await res.status(200).json({status: 200, data: result, notification: `Numéro de série récupéré.`})
  } catch (error) {
    return res.status(500).json({ error: error, notification: "Erreur système" });
  }
}