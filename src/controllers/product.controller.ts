const fs = require("fs");
const XLSX = require('xlsx');
const model = require("../models/index");
import { toLowerKeys } from "../helpers/format";
import { Request, Response } from "express";
import { getCategoryById, getCategories } from "../services/category.service";
import { createProduct, getProducts, getProductByCode } from "../services/product.service";
import { getShopByUuid } from "../services/shop.service";

module.exports.getProducts = async (req: Request, res: Response) => {
  try {
    const products: typeof model.Product = await getProducts(req);
		return res.status(200).json({status: 200, data: products, notification: 'Listes des Articles'});
  } catch (error) {
		return res.status(500).json({ error: error, notification: 'Erreur système'});
  }
};

module.exports.importCSVProduct = async (req: Request, res: Response) => {
  // Q09ERTtMQUJFTDtIVF9QUklDRTtUVENfUFJJQ0U7SVNfU0VSSUFMSVpBQkxFO0NPREVfQ0FUDQpBQ0NFU1MwMDE7VVNCIFNhbkRpc2sgMjU2Rzs4MDAwMDsxMDAwMDA7MDtBQ0NFU1MNCkpWMDAxO1BsYXlTdGF0aW9uIDU7MzIwMDAwMDs0MDAwMDAwOzE7SlY=
  try {
    const file = req.body.file;
    const base64FileDecoded = Buffer.from(file, "base64").toString("utf8");

    const fileData: string[] = base64FileDecoded.split("\r\n");

    let products: Object[] = [];
    let keys: string[] = fileData[0].split(";");

    // convert string file data to array
    const newFile = fileData.map(file => file.split(";"))

    // return code categories in file without header
    let codeCategories = newFile.map(file => file[5]).splice(1, newFile.length-1);

    // search category_id corresponding with code category
    const category: typeof model.Category[] = await model.Category.findAll({
      where: { code: codeCategories }
    });

    newFile.forEach((value, index) => {
      if (index > 0) {
        value[5] = category.filter(x => x.code === value[5])[0].category_id;
        let product = {
          [keys[0].toLowerCase()]: value[0],
          [keys[1].toLowerCase()]: value[1],
          [keys[2].toLowerCase()]: +value[2],
          [keys[3].toLowerCase()]: +value[3],
          [keys[4].toLowerCase()]: +value[4],
          'fk_category_id': value[5]
        };
        products.push(product);
      }
    })

    // insert multiple products if not already existing
    const newProducts = await model.Product.bulkCreate(
      products,
      {
        updateOnDuplicate: ["code"]
      }
    );

    return res.status(200).json({status: 200, data: newProducts, notification: 'Articles importés avec succès'});
  } catch (error) {
    return res
			.status(500)
			.json({ error: error, notification: "Erreur système" });
  }
};

module.exports.importProduct = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const bufferExcel = Buffer.from(body.file.toString().replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", ""),'base64');
    const workbook = XLSX.read(bufferExcel, { type: 'buffer' });
    const sheetNamesList = workbook.SheetNames;
    const excelProductData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNamesList[0]]);

    let product;
    if (excelProductData.length > 0) {
      product = await importProduct(excelProductData);
      if (!product['status']) {
        return res.status(500).json({ error: product.data, notification: "Erreur système" });
      }
    }

    const response =  product?.data;

    return res.status(200).json({status: 200, data: response, notification: 'Articles importés avec succès'});
  } catch (error) {
    return res
			.status(500)
			.json({ error: error, notification: "Erreur système" });
  }
};

const importProduct = async (product: typeof model.Product[]) => {
  try {
    // return code categories in file
    const codeCategories = product.map((data: typeof model.Product) =>{
      let item = toLowerKeys(data);
      return item.code_cat;
    });

    // search category_id corresponding with code category
    const category: typeof model.Category[] = await model.Category.findAll({
      where: { code: codeCategories }
    });

    let products: typeof model.Product[] = [];
    product.forEach((data: typeof model.Product) => {
      let value = toLowerKeys(data);
      const categoryId: number = category.filter(x => x.code === value.code_cat)[0].category_id;
      const product: typeof model.Product = {
        code: value.code,
        label: value.label,
        ht_price: value.ht_price,
        ttc_price: value.ttc_price,
        is_serializable: value.is_serializable,
        fk_category_id: categoryId
      };
      products.push(product);
    });


    // insert multiple products if not already existing
    const newProducts: typeof model.Product[] = await model.Product.bulkCreate(
      products,
      {
        updateOnDuplicate: ["code"]
      }
    );

    let response = {
      status: true,
      data: newProducts
    };
    return await response;
  } catch (error) {
    let response = {
      status: false,
      data: error
    };
    return await response;
  }
};

module.exports.exportProductModel = async (req: Request, res: Response) => {
  try {
    const contents = fs.readFileSync('src/config/files/product.xlsx', { encoding: 'base64' });
    return res.status(200).json({status: 200, data: {file: contents.toString()}, notification: ''});
  } catch (error) {
    return res
			.status(500)
			.json({ error: error, notification: "Erreur système" });
  }
}

module.exports.countProduct = async (req: Request, res: Response) => {
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
  try {
    const category: typeof model.Category = await getCategoryById(req.body.fk_category_id)
    if (!category) return res.status(404).json({status: 404, notification: 'Catégorie d\'article inconnue'});

    const product: typeof model.Product = {
      code: req.body.code,
      label: req.body.label,
      ht_price: req.body.ht_price,
      ttc_price: req.body.ttc_price,
      is_serializable: req.body.is_serializable,
      fk_category_id: category?.category_id
    };
    
    const newProduct = createProduct(product);
    return res.status(200).json({status: 200, data: newProduct, notification: 'Nombre d\'articles retournées'});
  } catch (error) {
    console.log(error);
    
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