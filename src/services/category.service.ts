const model = require("../models/index");
const sequelize = require("../config/db.config");
import { Request } from "express";
import { getPagination, getPagingData } from "../helpers/pagination";
import { Op } from "sequelize";
import { generateExcel, encodeFile } from "../helpers/helper";
var XLSX = require('xlsx');
var fs = require('fs');

export const getCategories = async(req: Request, paginate: number = 1) => {
  let condition: any = {}
  if (req.query.keyword) { 
    const keyword = req.query.keyword
    condition[Op.or] = [
      sequelize.where(sequelize.col('label'), { [Op.like]: `%${keyword}%`}),
      sequelize.where(sequelize.col('code'), { [Op.like]: `%${keyword}%`}),
    ]
  }
  try {
    if (paginate == 1) {
      // @todo enlevé - 1 sur la page pour avoir la page précis
      const page = (req.query.page && +req.query.page > 1) ? +req.query.page - 1 : 0;

      const { limit, offset } = getPagination(page, 10)
      const categories: typeof model.Category[] = await model.Category.findAndCountAll({
        where: condition,
        limit,
        offset,
        order: [
          ['label', 'ASC']
        ],
      });
      return getPagingData(categories, page, 10);
    } else {
      return await model.Category.findAll({
        include: model.Product,
        where: condition,
        order: [
          ['label', 'ASC']
        ],
      });
    }
  } catch (error: any) {
    console.log("\n category.service::getCategories");
    console.log(error);
    throw new Error(error);
  }
}

export const getCategoryByCode = async (code: typeof model.Category ) => {
  try {
    return await model.Category.findOne({
      include: model.Product,
      where: { code: code }
    });
  } catch (error: any) {
    console.log("\n category.service::getCategoryByCode");
    console.log(error);
    throw new Error(error);
  }
}

export const getCategoryByUuid = async (uuid: string) => {
  try {
    const category: typeof model.Category = await model.Category.findOne({
      include: model.Product,
      where: { category_uuid: uuid }
    });
    return formatCategory(category);
  } catch (error: any) {
    console.log("\n category.service::getCategoryByUuid");
    console.log(error);
    throw new Error(error);
  }
}

export const getCategoryById = async (id: string) => {
  try {
    const category: typeof model.Category = await model.Category.findOne({
      include: model.Product,
      where: { category_id: id }
    });
    return formatCategory(category);
  } catch (error: any) {
    console.log("\n category.service::getCategoryById");
    console.log(error);
    throw new Error(error);
  }
}

export const formatCategory = (category: typeof model.Category) => {
  return {
    category_id: category.category_id,
    category_uuid: category.category_uuid,
    code: category.code,
    label: category.label,
    products: category.products,
    product_count: category.products.length
  }
}

export const syncGetCategoryById = (id: string) => {
  try {
    return model.Category.findOne({
      include: model.Product,
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
  } catch (error: any) {
    console.log("\n category.service::createCategory");
    console.log(error);
    throw new Error(error);
  }
}
export const updateCategory = async (uuid: string, value: typeof model.Category) => {
  try {
    return await model.Category.update(
      value,
      {
        where: { category_uuid: uuid }
      }
    )
  } catch (error: any) {
    console.log("\n category.service::updateCategory");
    console.log(error);
    throw new Error(error);
  }
}

export const importCategory = async (file: any) => {
  try {
    //const bufferExcel = Buffer.from(file.toString().replace("data:@file/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", ""),'base64');
    const bufferExcel = Buffer.from(file.toString().replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", ""),'base64');
    const workbook = XLSX.read(bufferExcel, { type: 'buffer' });
    const sheetNamesList = workbook.SheetNames;
    const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNamesList[0]]);
    let errors: any = {
      total: 0,
      data: []
    };
    let success: any = {
      total: 0,
      data: []
    }
    excelData.forEach((data: any, i: number) => {
      let value = data;
      delete Object.assign(value, {code: value['[CODE] code']})['[CODE] code'];
      delete Object.assign(value, {label: value['[LABEL] label']})['[LABEL] label'];

      if (value.code && value.code != '' && value.label && value.label != '') {
        success.total ++;
        success.data.push({
          code: value.code.toUpperCase(),
          label: value.label
        })
      } else {
        errors.total ++;
        errors['data'].push({
          '[CODE] code': (!value.code || value.code == '') ? '' : value.code,
          '[LABEL] label': (!value.label  || value.label == '') ? '' : value.label,
        })
      }
    });
    await createCategory(success.data);

    const timestamp = new Date().getTime();
    const fileName = timestamp + ".xlsx";
    let fileEncoded = '';
    if (errors.total > 0) {
      generateExcel(errors.data, fileName);
      fileEncoded = encodeFile(fileName);
      if (fileEncoded != '') fs.unlinkSync(fileName);
    }
    return await {
      success: success.total,
      error:  errors.total,
      fileName: fileEncoded
    }
  } catch (error: any) {
    console.log("\n category.service::importCategory");
    console.log(error);
    throw new Error(error);
  }
}