const model = require("../models/index");
const { Op } = require("sequelize");
import { Request } from "express";
import { getPagination, getPagingData } from "../helpers/pagination";

export const getProducts = async (req: Request, categoryId: string = '') => {
  let conditions = {};
  if (categoryId != '') conditions = {fk_category_id: categoryId}
  if (req.query.search && req.query.search != '') {
    conditions = {
      [ Op.or ]: [
        {
          label: { [ Op.like ]: `%${req.query.search}%` }
        },
        {
          code: { [ Op.like ]: `%${req.query.search}%` }
        }
      ]
    }
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
            lowPrice = ttcPrice;
            highPrice = ttcPrice;
          } else if (highPrice < ttcPrice && lowPrice < ttcPrice) {
            highPrice = ttcPrice;
          } else if (highPrice > ttcPrice && lowPrice > ttcPrice) {
            lowPrice = ttcPrice;
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

export const createProduct = async (product: typeof model.Product) => {
  try {
    return await model.Product.create(
      product, 
      {
        updateOnDuplicate: ["code", "label"],
      }
    )
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