const model = require("../models/index");
const { Op } = require("sequelize");
import { Request } from "express";
import { getPagination, getPagingData } from "../helpers/pagination";

export const getProducts = async (req: Request, shopId: number = 0) => {
  let conditions = {};
  if (shopId != 0) conditions = {shop_id: shopId}
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
  
      const products: typeof model.Product[] = await model.Product.findAndCountAll({
        include:[
          { model: model.Category}
        ],
        where: conditions,
        offset,
        limit,
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

  } catch (error) {
    throw error;
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