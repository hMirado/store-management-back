const model = require("../models/index");
import { Request } from "express";
import { getPagination, getPagingData } from "../helpers/pagination";

export const getCategories = async(req: Request) => {
  try {
    if (req.query.paginate && req.query.paginate == '1') {
      // @todo enlevé - 1 sur la page pour avoir la page précis
      const page = (req.query.page && +req.query.page > 1) ? +req.query.page - 1 : 0;

      const { limit, offset } = getPagination(page, 10)
      const categories: typeof model.Category[] = await model.Category.findAndCountAll({
        include: model.Product,
        limit,
        offset,
        order: [
          ['label', 'ASC']
        ],
      });

      return getPagingData(categories, page, 10);
    } else {
      return await model.Category.findAll({
        include: model.Product
      });
    }
  } catch (error) {
    throw error;
  }
}

export const getCategoryByCode = async (code: typeof model.Category ) => {
  try {
    return await model.Category.findOne({
      where: { code: code }
    });
  } catch (error) {
    throw error;
  }
}

export const getCategoryById = async (id: string) => {
  try {
    return await model.Category.findOne({
      where: { category_id: id }
    });
  } catch (error) {
    throw error;
  }
}

export const syncGetCategoryById = (id: string) => {
  try {
    return model.Category.findOne({
      where: { category_id: id }
    });
  } catch (error) {
    throw error;
  }
}

export const createCategory = async (categories: typeof model.Category[]) => {
  try {
    return await model.Category.bulkCreate(
      categories,
      {
        updateOnDuplicate: ["code", "label"]
      }
    )
  } catch (error) {
    throw error;
  }
}