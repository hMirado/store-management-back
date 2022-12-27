import { Request, Response } from "express";
import { toLowerKeys } from "../helpers/format";
import { createCategory, getCategories } from "../services/category.service";
import {IGetUserAuthInfoRequest} from "../modules/my-request";
const model = require("../models/index");
const fs = require("fs");
var XLSX = require('xlsx');

module.exports.getCategories = async (req: IGetUserAuthInfoRequest, res: Response) => {
	try {
    const categories: typeof model.Category = await getCategories(req);
		return res
			.status(200)
			.json({
				status: 200,
				data: categories,
				notification: "Listes des catégories de produits",
			});
	} catch (error) {
		return res
			.status(500)
			.json({ error: error, notification: "Erreur système" });
	}
};

module.exports.importCSVCategory = async (req: IGetUserAuthInfoRequest, res: Response) => {
  //"Y29kZTtsYWJlbA0KQUNDRVNTO0FjY2Vzc29pcmUNCkFQQztBcHBhcmVpbCBwaG90byAmIGNhbcOpcmENCkpWO0pldXggdmlkw6lvDQpPUEM7T3JkaW5hdGV1ciAmIFBDDQpQSE9ORTtTbWFydHBob25lDQpUQlQ7VGFibGV0dGU="
	try {
		const body = req.body;
		const base64FileDecoded = Buffer.from(body.file, "base64").toString("utf8");

    let categories: Object[] = [];
    const files: string[] = base64FileDecoded.split("\r\n");
    let keys: string[] = [];
    keys = files[0].split(";");

    files.forEach((value, index) => {
      let data: string[] = value.split(";");
      if (index > 0) {
        let category = {
          [keys[0]]: data[0],
          [keys[1]]: data[1],
        };
        categories.push(category)
      }
    });

    const newCategories = await model.Category.bulkCreate(
      categories,
      {
        updateOnDuplicate: ["code"],
      }
    );
    return res.status(200).json({status: 200, data: newCategories, notification: 'Catégories importées avec succès'});
	} catch (error) {
		return res
			.status(500)
			.json({ error: error, notification: "Erreur système" });
	}
};

module.exports.importCategory = async (req: IGetUserAuthInfoRequest, res: Response) => {
	try {
    const body = req.body;

    //const bufferExcel = Buffer.from(body.file.toString().replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64", ""),'base64');
    const bufferExcel = Buffer.from(body.file.toString().replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64", ""),'base64');
    const workbook = XLSX.read(bufferExcel, { type: 'buffer' });
    //var workbook = XLSX.read(body.file.replace(/_/g, "/").replace(/-/g, "+"), {type:'base64'})
    const sheetNamesList = workbook.SheetNames;

    const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNamesList[0]]);

    let categories: typeof model.Category[] = [];
    excelData.forEach((data: typeof model.Category) => {
      let value = toLowerKeys(data);
      const category: typeof model.Category = {
        code: value.code,
        label: value.label
      };
      categories.push(category)
    });
    const newCategories = await model.Category.bulkCreate(
      categories,
      {
        updateOnDuplicate: ["code"],
      }
    );
    return res.status(200).json({status: 200, data: newCategories, notification: 'Catégories importées avec succès'});
	} catch (error) {
		return res
			.status(500)
			.json({ error: error, notification: "Erreur système" });
	}
};

module.exports.exportCategoryModel =async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {
    const contents = fs.readFileSync('src/config/files/category.xlsx', { encoding: 'base64' });
    return res.status(200).json({status: 200, data: {file: contents}, notification: ''});
  } catch (error) {
    return res
			.status(500)
			.json({ error: error, notification: "Erreur système" });
  }
};

module.exports.countCategories = async (req: Request, res: Response) => {
  try {
    const category = await model.Category.count();
    return res.status(200).json({status: 200, data: category, notification: 'Nombre des catégories retournées'});
  } catch (error) {
    return res
			.status(500)
			.json({ error: error, notification: "Erreur système" });
  }
};

export const createCategories = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {
    const newCategories = await createCategory(req.body);
    return res.status(200).json({status: 200, data: newCategories, notification: 'Catégories enregistrées avec succès'});
  } catch (error) {
    return res.status(500).json({ error: error, notification: "Erreur système" });
  }
};