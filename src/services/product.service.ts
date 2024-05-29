const model = require("../models/index");
const { Op } = require("sequelize");
import { Request } from "express";
import { getPagination, getPagingData } from "../helpers/pagination";
import { getShops } from "./shop.service";
import { createMuliplePrice } from "./price.service";
const sequelize = require("../config/db.config");
import { convertToExcel, generateExcel, encodeFile } from "../helpers/helper"
import { getCategoryByCode } from "./category.service";
const fs = require('fs');

export const getProductsOld = async (req: Request, categoryId: string = '') => {
  let conditions: any = {};
  if (categoryId != '') conditions['fk_category_id'] = +categoryId
  if (req.query.search && req.query.search != '') {
    conditions[Op.or] = [
        {
          label: { [ Op.like ]: `%${req.query.search}%` }
        },
        {
          code: { [ Op.like ]: `%${req.query.search}%` }
        }
      ]
  }
  try {
    if (req.query.paginate && req.query.paginate == '1') {
      const page = (req.query.page && +req.query.page > 1) ? +req.query.page - 1 : 0;
      const size = req.query.size ? req.query.size : 10;
      const { limit, offset } = getPagination(page, +size)
  
      const products: typeof model.Product = await model.Product.findAndCountAll({
        include:[
          { model: model.Category},
          { model: model.Price }
        ],
        where: conditions,
        offset,
        limit,
        distinct: true,
        order: [
          ['label', 'ASC']
        ],
      });
      let formatedProducts: any[] = [];
      products.rows.forEach((product: typeof model.Product, i: number) => {
        let lowPrice: number = 0;
        let highPrice: number = 0;
        const prices = product.prices
        prices.forEach((price: typeof model.Price, index: number) => {
          const ttcPrice =price.ttc_price;
          if (index == 0) {
            lowPrice = ttcPrice / 100;
            highPrice = ttcPrice / 100;
          } else if (highPrice < ttcPrice && lowPrice < ttcPrice) {
            highPrice = ttcPrice / 100;
          } else if (highPrice > ttcPrice && lowPrice > ttcPrice) {
            lowPrice = ttcPrice / 100;
          }
        })
        const newProduct = {
          product_id: product.product_id,
          product_uuid: product.product_uuid,
          code: product.code,
          label: product.label,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          is_serializable: product.is_serializable,
          fk_category_id: product.fk_category_id,
          category: product.category,
          prices: product.prices,
          low_price: lowPrice,
          high_price: highPrice
        }
        formatedProducts.push(newProduct)
      });
      const result = {
        count: products.count,
        rows: formatedProducts
      }
      
      return getPagingData(result, +page, 10);
    } else {
      return await model.Product.findAll(
        {
          include: [
            { model: model.Category },
            { model: model.Stock }
          ],
          where: conditions
        }
      );
    }
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}

export const getProducts = async (req: Request, categoryId: string = '') => {
  let conditions: any = {};
  if (categoryId != '') conditions['fk_category_id'] = +categoryId
  if (req.query.search && req.query.search != '') {
    conditions[Op.or] = [
        {
          label: { [ Op.like ]: `%${req.query.search}%` }
        },
        {
          code: { [ Op.like ]: `%${req.query.search}%` }
        }
      ]
  }
  try {
    if (req.query.paginate && req.query.paginate == '1') {
      const page = (req.query.page && +req.query.page > 1) ? +req.query.page - 1 : 0;
      const size = req.query.size ? req.query.size : 10;
      const { limit, offset } = getPagination(page, +size);
      const products: typeof model.Product = await model.Product.findAndCountAll({
        include: [
          { model: model.Category },
          { model: model.Stock }
        ],
        where: conditions,
        offset,
        limit,
        distinct: true,
        order: [
          ['label', 'ASC']
        ],
      });
      return getPagingData(products, +page, 10);
    } else {
      return await model.Product.findAll(
        {
          include: [
            { model: model.Category },
            { model: model.Stock }
          ],
          where: conditions
        }
      );
    }
  } catch (error: any) {
    console.error("product.service::getProducts", error);
    throw new Error(error);
  }
}

export const getProductById = async (id: number) => {
  try {
    return await model.Product.findOne({
      where: { product_id: id }
    })
  } catch (error) {
    throw error;
  }
}

export const getProductByUuid = async (uuid: string, withImage: boolean = false, hostName: string = '') => {
  try {
    const product = await model.Product.findOne({
      include: [
        {model: model.Category},
        {model: model.Price}
      ],
      where: { product_uuid: uuid }
    });
    if (withImage) {  
      const hasImage = (product.image && product.image != '') ? true: false
      const image = {
        hasImage: hasImage,
        path: hasImage ? `products/${product.image }` : ''
      }
      delete product.image;
      return await {product, image};
    } else {
      return await product;
    }
  } catch (error) {
    throw error;
  }
}

export const getProductByCode = async (code: string) => {
  try {
    return await model.Product.findOne({
      where: { code: code }
    })
  } catch (error) {
    throw error;
  }
}

export const getProductByLabel = async (label: string) => {
  try {
    return await model.Product.findOne({
      where: { label: label }
    })
  } catch (error) {
    throw error;
  }
}

export const getSaleProducts = async (req: Request, shop: number) => {
  let conditions: any = {};
  if (req.query.category && req.query.category != '') conditions['fk_category_id'] = +req.query.category
  if (req.query.search && req.query.search != '') {
    conditions[Op.or] = [
        {
          label: { [ Op.like ]: `%${req.query.search}%` }
        },
        {
          code: { [ Op.like ]: `%${req.query.search}%` }
        }
      ]
  }
  try {
    if (req.query.paginate && req.query.paginate == '1') {
      const page = (req.query.page && +req.query.page > 1) ? +req.query.page - 1 : 0;
      const size = req.query.size ? req.query.size : 10;
      const { limit, offset } = getPagination(page, +size);
      const products: typeof model.Product = await model.Product.findAndCountAll({
        include: [
          { 
            model: model.Category,
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
          },
          { 
            model: model.Stock,
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'fk_shop_id', 'fk_product_id'] },
            where: {
              fk_shop_id: shop
            },
            required: false
          },
          {
            model: model.Price,
            where: {
              fk_shop_id: shop
            }
          }
        ],
        where: conditions,
        offset,
        limit,
        distinct: true,
        order: [
          ['label', 'ASC']
        ],
      });

      let formatedProducts: typeof model.Product = [];
      products.rows.forEach((product: typeof model.Product) => {
        const stock = product.stocks.length > 0 ? product.stocks[0].quantity : 0;
        const prd = {
          product_id: product.product_id,
          product_uuid: product.product_uuid,
          code: product.code,
          label: product.label,
          is_serializable: product.is_serializable,
          image: product.image,
          fk_category_id: product.fk_category_id,
          category: product.category,
          stock: stock,
          price: product.prices[0].ttc_price / 100,
        }

        formatedProducts.push(prd)
      })
      

      return getPagingData({count: products.count, rows: formatedProducts}, +page, +size);
    } else {
      return await model.Product.findAll(
        {
          include: [
            { model: model.Category },
            { model: model.Stock }
          ],
          where: conditions
        }
      );
    }
  } catch (error: any) {
    console.error("product.service::getProducts", error);
    throw new Error(error);
  }
}

export const getProductByDetail = async (uuid: string) => {
  try {
    const products: typeof model.Product[] = await model.Product.findOne({
      include: [
        { 
          model: model.Price,
          include: {
            model: model.Attribute,
            include: model.AttributeType
          }
        },

      ],
      where: { product_uuid: uuid }
    })

    return products;
  } catch (error: any) {
    console.error("product.service::getProductByDetail", error);
    throw new Error(error);
  }
}

export const getProductByLabelOrCode = async (search: string) => {
  try {
    return await model.Product.findOne({
      where: {
        [Op.or]: [
          { code: search },
          { label: search },
        ]
      }
    });
  } catch (error: any) {
    console.error("product.service::getProductByLabelOrCode", error);
    throw new Error(error);
  }
}


export const createProduct = async (product: typeof model.Product, transaction: typeof sequelize.IDBTransaction|null = null) => {
  try {
    return await model.Product.create(
      product, 
      {
        updateOnDuplicate: ["code", "label"],
      },
      {transaction: transaction}
    )
  } catch (error: any) {
    console.error("product.service::createProduct", error);
    throw new Error(error);
  }
}

export const createProductWithPrice = async (products: []) => {
  const transaction = await sequelize.transaction();
  try {
    const shops: typeof model.Shop[] = await getShops();
    const shopIds = shops.map((shop: typeof model.Shop) => shop.shop_id);

    let prices: typeof model.Price[] = [];

    for (let product of products) {
      const productByLabel: typeof model.Product = await getProductByLabelOrCode(product['label']);
      const productByCode: typeof model.Product = await getProductByLabelOrCode(product['label']);

      if (!productByLabel && !productByCode) {
        const newProduct = {
          code: product['code'],
          label: product['label'],
          is_serializable: product['is_serializable'],
          fk_category_id: +product['fk_category_id'],
        }
        const createdProduct = await createProduct(newProduct, transaction);
        const htPrice = product['price'] * 0.8;
        for (const id of shopIds) {
          prices.push({
            ht_price: htPrice * 100,
            ttc_price: product['price'] * 100,
            fk_product_id: createdProduct.product_id,
            fk_shop_id: id
          });
        }
      }
    }
    const price = await createMuliplePrice(prices, transaction);
    await transaction.commit();
    return price ? true : false;
  } catch (error: any) {
    await transaction.rollback();
    console.error("product.service::createProductWithPrice", error);
    throw new Error(error);
  }
}

export const updateProduct = async (value: typeof model.Product) => {
  const productUuid = value.product_uuid;
  const newValue = {
    code: value.code,
    label: value.label,
    is_serializable: value.is_serializable,
    fk_id_category: value.fk_category_id
  }
  try {
    const isUpdated = await model.Product.update(
      newValue,
      {
        where: {
          product_uuid: productUuid
        }
      }
    ).then(async() => {return await getProductByUuid(productUuid)});
    return isUpdated
  } catch (error: any) {
    console.error("product.service::updateProduct", error);
    throw new Error(error);
  }
}

export const importProduct = async (base64: string) => {
  const transaction = await sequelize.transaction();
  try {
    const excelData = convertToExcel(base64);
    let errors: any = {
      total: 0,
      data: []
    };
    let success: number = 0;
    let prices: typeof model.Price[] = [];
    for (const data of excelData) {
      let value = data;
      delete Object.assign(value, {code: value['[CODE_ITEM] code article']})['[CODE_ITEM] code article'];
      delete Object.assign(value, {label: value['[LABEL] Libellé']})['[LABEL] Libellé'];
      delete Object.assign(value, {isSerializable: value['[IS_SERIALIZABLE] Sérialization']})['[IS_SERIALIZABLE] Sérialization'];
      delete Object.assign(value, {price: value['[PRICE] Prix']})['[PRICE] Prix'];
      delete Object.assign(value, {category: value['[CODE_CATEGORY] Catégorie']})['[CODE_CATEGORY] Catégorie'];

      if (!value.code || !value.label || !value.price || !value.category) {
        errors.total ++;
        errors['data'].push({
          '[CODE_ITEM] code article': !value.code ? '' : value.code,
          '[LABEL] Libellé': !value.label ? '' : value.label,
          '[PRICE] Prix': !value.price ? '' : value.price,
          '[CODE_CATEGORY] Catégorie': !value.category ? '' : value.category,
        })
      } else {
        const category = await getCategoryByCode(value.category);
        if (!category || category == null) {
          errors.total ++;
          errors['data'].push({
            '[CODE_ITEM] code article': !value.code ? '' : value.code,
            '[LABEL] Libellé': !value.label ? '' : value.label,
            '[PRICE] Prix': !value.price ? '' : value.price,
            '[CODE_CATEGORY] Catégorie': !value.category ? '' : value.category,
          })
        } else {
          value.isSerializable = !value.isSerializable ? 0 : value.isSerializable;
          const shops: typeof model.Shop[] = await getShops();
          const shopIds = shops.map((shop: typeof model.Shop) => shop.shop_id);

          const product = {
            code: value.code,
            label: value.label,
            is_serializable: value.isSerializable,
            fk_category_id: category.category_id
          }
          const createdProduct = await createProduct(product, transaction);
          const htPrice = +value.price * 0.8;
          for (const id of shopIds) {
            prices.push({
              ht_price: htPrice * 100,
              ttc_price: +value.price * 100,
              fk_product_id: createdProduct.product_id,
              fk_shop_id: id
            });
          }
          success ++
        }
      }
    };
    await createMuliplePrice(prices, transaction);
    transaction.commit();

    const timestamp = new Date().getTime();
    const fileName = timestamp + ".xlsx";
    let fileEncoded = '';
    if (errors.total > 0) {
      generateExcel(errors.data, fileName);
      fileEncoded = encodeFile(fileName);
      if (fileEncoded != '') fs.unlinkSync(fileName);
    }
    return await {
      success: success,
      error:  errors.total,
      file: fileEncoded
    }
  } catch (error: any) {
    console.error("product.service::importProduct", error);
    throw new Error(error);
  }
}

export const addImage = async (base64: string, product: typeof model.Product) => {
  try {
    const base64Type = base64.split(',/')[0].toLocaleLowerCase();
    let file = ''
    let type = '';
    
    if (base64Type.includes('png;base64')){
      type = 'png';
      file = base64.toString().replace(base64Type, "");
    } else if (base64Type.includes(base64Type)) {
      type = 'jpeg';
      file = base64.toString().replace(base64Type, "");
    } else if (base64Type.includes('jpg;base64')) {
      type = 'jpg';
      file = base64.toString().replace(base64Type, "");
    } 

    const buffer = Buffer.from(file,'base64');
    const timestamp = new Date().getTime();
    const fileName = product.product_uuid + '_' + timestamp + "." + type;

    if (product.image != null && product.image != '')  fs.unlinkSync(`src/uploads/images/products/${product.image}`);

    let productUpdated = await model.Product.update(
      { image: fileName },
      {
        where: {
          product_uuid: product.product_uuid
        }
      }
    ).then(async() => {
      fs.writeFileSync(`src/uploads/images/products/${fileName}`, buffer);
      return await getProductByUuid(product.product_uuid);
    });

    const hasImage = (productUpdated.image && productUpdated.image != '') ? true: false
    const image = {
      hasImage: hasImage,
      path: hasImage ? `products/${fileName}` : ''
    }
    
    return await {product, image};
  } catch (error: any) {
    console.error("product.service::updateProduct", error);
    throw new Error(error);
  }
}

export const removeImage = async (product: typeof model.Product) => {
  try {
    if (product.image != null || product.image != '') fs.unlinkSync(`src/uploads/images/products/${product.image}`);
    const productUpdated = await model.Product.update(
      { image: null },
      {
        where: {
          product_uuid: product.product_uuid
        }
      }
    );
    const image = {
      hasImage: false,
      path: '',
    }
    delete productUpdated.image;
    return await {product, image};
  } catch (error: any) {
    console.error("product.service::removeImage", error);
    throw new Error(error);
  }
}