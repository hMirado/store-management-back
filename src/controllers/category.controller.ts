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



export const countCategories = async (req: Request, res: Response) => {
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