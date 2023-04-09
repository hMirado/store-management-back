const fs = require("fs");
const XLSX = require('xlsx');
const model = require("../models/index");
import { toLowerKeys } from "../helpers/format";
import { Request, Response } from "express";
import { getCategories, getCategoryById, getCategoryByUuid } from "../services/category.service";
import { createProduct, getProducts, getProductByCode } from "../services/product.service";
import { getShopByUuid } from "../services/shop.service";

export const getProductsHandler = async (req: Request, res: Response) => {
  try {
    let categoryId: string = ''
    if (req.query.category) {
      const category: typeof model.Category = await getCategoryByUuid(req.query.category as string);
      categoryId = category.category_id
    }
    const products: any = await getProducts(req, categoryId);
		return res.status(200).json({status: 200, data: products, notification: 'Listes des Articles'});
  } catch (error) {
		return res.status(500).json({ error: error, notification: 'Erreur système'});
  }
};

export const countProductHandler = async (req: Request, res: Response) => {
  try {
    const product = await model.Product.count();
    return res.status(200).json({status: 200, data: product, notification: 'Nombre d\'articles retournées'});
  } catch (error) {
    return res
			.status(500)
			.json({ error: error, notification: "Erreur système" });
  }
};

export const createProductHandler = async (req: Request, res: Response) => {
  const products: typeof model.Product[] = req.body;
  let errors: Object[] = [];
  let errorCount: number = 0;
  let successCount: number = 0;
  try {
    for(let product of products) {
      const index = products.indexOf(product)
      const category = await getCategoryById(product.fk_category_id);
      if (category) {
        successCount ++;
        createProduct(product);
      } else {
        errorCount ++
        errors.push(
          {
            line: index + 1,
            product: product.label
          }
        )
      }
    };

    const result = {
      successCount: successCount,
      errorCount: errorCount,
      errors: errors
    }
    return res.status(201).json({status: 201, data: result, notification: 'Nombre d\'articles retournées'});
  } catch (error) {
    return res
			.status(500)
			.json({ error: error, notification: "Erreur système" });
  }
};

export const getProductByCodeHandler = async (req: Request, res: Response) => {
  try {
    const results = await getProductByCode(req.params.code);
		return res.status(200).json({status: 200, data: results, notification: 'Détail de l\'article'});
  } catch (error) {
		return res.status(500).json({ error: error, notification: 'Erreur système'});
  }
};

export const getSaleProductsHandler = async (req: Request, res: Response) => {
  try {
    const shop: typeof model.Shop = await getShopByUuid(req.params.shopUuid)
    if (!shop) return res.status(400).json({ status: 400, error: 'Ressource non trouvée', notification: 'La boutique indiquée est inexistante.'});

    const products: typeof model.Product = await getProducts(req, shop.shopId);
    const categories: typeof model.Category = await getCategories(req);
    return res.status(200).json({status: 200, data: {categories, products}, notification: 'Liste des produits et des catégories'});
  } catch (error) {
    return res.status(500).json({ error: error, notification: 'Erreur système'});
  }
};