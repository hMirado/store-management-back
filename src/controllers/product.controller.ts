const model = require("../models/index");
import { Request, Response } from "express";
import { getCategories, getCategoryById, getCategoryByUuid } from "../services/category.service";
import { 
  createProduct, 
  getProducts, 
  getProductByCode, 
  getProductByDetail,
  createProductWithPrice,
  getProductByLabelOrCode,
  updateProduct,
  getProductByUuid,
  getProductByLabel,
  importProduct,
  addImage,
  removeImage
} from "../services/product.service";
import { getShopByUuidOrCode } from "../services/shop.service";
import { encodeFile } from "../helpers/helper";

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

export const getProductByCodeHandler = async (req: Request, res: Response) => {
  try {
    const results = await getProductByCode(req.params.code);
		return res.status(200).json({status: 200, data: results, notification: 'Détail de l\'article'});
  } catch (error: any) {
    console.error('\nproduct.controller::getProductByCodeHandler', error);
		return res.status(500).json({ error: error, notification: 'Erreur système'});
  }
}

export const getProductByLabelHandler = async (req: Request, res: Response) => {
  try {
    const results = await getProductByLabel(req.params.label);
		return res.status(200).json({status: 200, data: results, notification: 'Détail de l\'article'});
  } catch (error: any) {
    console.error('\nproduct.controller::getProductByCodeHandler', error);
		return res.status(500).json({ error: error, notification: 'Erreur système'});
  }
};

export const getProductByDetailHandler = async (req: Request, res: Response) => {
  try {
    const results = await getProductByDetail(req.params.uuid);
		return res.status(200).json({status: 200, data: results, notification: 'Détail de l\'article'});
  } catch (error: any) {
    console.error('\nproduct.controller::getProductByDetailHandler', error);
		return res.status(500).json({ error: error, notification: 'Erreur système'});
  }
}

export const getSaleProductsHandler = async (req: Request, res: Response) => {
  try {
    const shop: typeof model.Shop = await getShopByUuidOrCode(req.params.shopUuid)
    if (!shop) return res.status(400).json({ status: 400, error: 'Ressource non trouvée', notification: 'La boutique indiquée est inexistante.'});

    const products: typeof model.Product = await getProducts(req, shop.shopId);
    const categories: typeof model.Category = await getCategories(req);
    return res.status(200).json({status: 200, data: {categories, products}, notification: 'Liste des produits et des catégories'});
  } catch (error: any) {
    console.error('product.controller::getSaleProductsHandler', error);
    return res.status(500).json({ error: error, notification: 'Erreur système'});
  }
};

export const getProductByLabelOrCodeHandler = async (req: Request, res: Response) => {
  try {
    const product: typeof model.Product = await getProductByLabelOrCode(req.query.search as string);
    return res.status(200).json({status: 200, data: {isExist: product ? true : false}, notification: 'Details de l\'article'});
  } catch (error: any) {
    console.error('product.controller::getProductByLabelOrCodeHandler', error);
    return res.status(500).json({ error: error, notification: 'Erreur système'});
  }
}

export const getProductByUuidHandler = async (req: Request, res: Response) => {
  try {
    const product = await getProductByUuid(req.params.uuid as string);
    return res.status(200).json({status: 200, data: product, notification: 'Details de l\'article'});
  } catch (error: any) {
    console.error('product.controller::getProductByLabelOrCodeHandler', error);
    return res.status(500).json({ error: error, notification: 'Erreur système'});
  }
}

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

export const createProductWithPriceHandler = async (req: Request, res: Response) => {
  try {
    const isCreated = await createProductWithPrice(req.body);
    return res.status(201).json({status: 201, data: isCreated, notification: 'Articel crée'});
  } catch (error: any) {
    console.error('product.controller::createProductWithPriceHandler', error);
    return res.status(500).json({ error: error, notification: 'Erreur système'});
  }
}

export const updateProductHandler = async (req: Request, res: Response) => {
  try {
    const product = await getProductByUuid(req.body.product_uuid);
    if (!product) return res.status(400).json({ status: 400, error: 'Ressource non trouvée', notification: 'Article inéxistant.'});
    if (req.body.code == '' || req.body.label == '') return res.status(400).json({ status: 400, error: 'Ressource non trouvée', notification: 'Veuillez renseigner tous les champs.'});
    const update = await updateProduct(req.body);
    return res.status(201).json({status: 201, data: update, notification: 'L`\article a été modifié avec succès.'});
  } catch (error: any) {
    console.error('product.controller::getProductByLabelOrCodeHandler', error);
    return res.status(500).json({ error: error, notification: 'Erreur système'});
  }
}

export const importProductHandler = async (req: Request, res: Response) => {
  try {
    const file = req.body.file;
    if (!file.includes("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,"))
      return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Format invalide. Le fichier n\'est pas de format XLS/XLSX.'});
    const response = await importProduct(file);
    return res.status(201).json({status: 201, data: response, notification: 'Importation effectué.'});
  } catch (error) {
    console.error('product.controller::importProductHandler', error);
    return res.status(500).json({ error: error, notification: 'Erreur système'});
  }
}

export const exportModelHandler = async (req: Request, res: Response) => {
  try {
    const fileName = 'files/models/product.xlsx';
    const encodedFile = encodeFile(fileName);
    return res.status(200).json({status: 200, data: encodedFile, notification: 'Export du modèle effectué.'});
  } catch (error) {
    console.error('product.controller::exportModelHandler', error);
    return res.status(500).json({ error: error, notification: 'Erreur système'});
  }
}

export const addImageHandler = async (req: Request, res: Response) => {
  try {
    const img = req.body.file;
    const productUuid = req.body.product;

    const product = await getProductByUuid(productUuid);
    if (!product) return res.status(400).json({ status: 400, error: 'Ressource non trouvée', notification: 'Article inéxistant.'});

    if (!img.includes("data:@file/jpeg;base64,") && !img.includes("data:@file/jpg;base64,") && !img.includes("data:@file/png;base64,"))
      return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: "Le format de l'image n'est pas pris en charge."});

    const response = await addImage(img, product);
    return res.status(201).json({status: 201, data: response, notification: 'Image ajouté.'});
  } catch (error) {
    console.error('product.controller::addImageHandler', error);
    return res.status(500).json({ error: error, notification: 'Erreur système'});
  }
}
export const removeImageHandler = async (req: Request, res: Response) => {
  try {
    const productUuid = req.body.product;
    const product = await getProductByUuid(productUuid);
    if (!product) return res.status(400).json({ status: 400, error: 'Ressource non trouvée', notification: 'Article inéxistant.'});
    const response = await removeImage(product);
    return res.status(201).json({status: 201, data: response, notification: 'Image supprimer.'});
  } catch (error) {
    console.error('product.controller::removeImageHandler', error);
    return res.status(500).json({ error: error, notification: 'Erreur système'});
  }
}