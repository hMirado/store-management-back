import { Request, Response } from "express";
import { importStock, getProductsInStock, getStock } from '../services/stock.service'
import { getShopByUuid } from '../services/shop.service'
import { getStockMovmentTypeByMovment } from '../services/stock-movment-type.service'
import { getProductByUuid } from "../services/product.service";

module.exports.addStock =async (req: Request, res: Response) => {
  try {
    const stock = ['addStock(req)'];
    return res.status(200).json({status: 200, data: stock, notification: 'Stock importées avec succès'});
  } catch (error) {
    return res
			.status(500)
			.json({ error: error, notification: "Erreur système" });
  }
}

export const importStockHandler = async (req: Request, res: Response) => {
  try {
    const shop = await getShopByUuid(req.params.shop);
    if (!shop) return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Shop inexistant.'});
    
    const movment = await getStockMovmentTypeByMovment('IN');

    await importStock(req, shop.shop_id, movment.stock_movment_type_id);
    return res.status(200).json({status: 200, data: {imported: true}, notification: 'Stock importées avec succès'});
  } catch (error: any) {
    return res
			.status(500)
			.json({ error: error, notification: "Erreur système" });
  }
}

export const getProductsInStockHandler = async (req: Request, res: Response) => {
  const shopUuid: string = req.query.shop as string
  try {
    const shop = await getShopByUuid(shopUuid);
    if (!shop) return res.status(404).json({ status: 404, error: 'La syntaxe de la requête est erronée.', notification: 'Shop inexistant.'});
     
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
    if (!shop) return res.status(404).json({ status: 404, error: 'La syntaxe de la requête est erronée.', notification: 'Shop inexistant.'});

    const product = await getProductByUuid(productUuid);
    if (!product) return res.status(404).json({status: 404, error: 'La syntaxe de la requête est erronée.', notification: 'Produit inéxitant'});
     
    const stock = await getStock(shopUuid, productUuid);
    return await res.status(200).json({status: 200, data: stock, notification: 'Liste des stocks récupérés.'})
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({ error: error, notification: "Erreur système" });
  }
}