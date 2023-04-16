const model = require("../models/index");
const { Op } = require("sequelize");
import { Request } from "express";
import { getPagination, getPagingData } from "../helpers/pagination";
import { getShop } from "./shop.service";
import { createMuliplePrice } from "./price.service";
const sequelize = require("../config/db.config");

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
        include: model.Category,
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

export const getProductByUuid = async (uuid: string) => {
  try {
    return await model.Product.findOne({
      include: [
        {model: model.Category},
        {model: model.Price}
      ],
      where: { product_uuid: uuid }
    })
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

export const getSaleProducts = async (req: Request) => {
  try {
    return await model.Product.findAll({
      include: {
        model: model.Category
      }
    });
  } catch (error) {
    throw error;
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


export const createProduct = async (product: typeof model.Product, transaction: IDBTransaction|null = null) => {
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
    const shops: typeof model.Shop[] = await getShop();
    const shopIds = shops.map((shop: typeof model.Shop) => shop.shop_id);

    let prices: typeof model.Price[] = [];

    for (let product of products) {
      const productByLabel: typeof model.Product = getProductByLabelOrCode(product['label']);
      const productByCode: typeof model.Product = getProductByLabelOrCode(product['label']);

      if (!productByLabel && !productByCode) {
        const newProduct = {
          code: product['code'],
          label: product['label'],
          is_serializabe: product['is_serializabe'],
          fk_category_id: +product['category'],
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
    const price = await createMuliplePrice(prices, transaction)
    return price ? true : false;
  } catch (error: any) {
    console.error("product.service::createProductWithPrice", error);
    throw new Error(error);
  }
}

export const updateProduct = async (value: typeof model.Product) => {
  console.log(value);
  
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