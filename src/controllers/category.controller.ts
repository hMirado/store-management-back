import { Request, Response } from "express";
import { createCategory, getCategories, updateCategory, getCategoryByUuid, importCategory } from "../services/category.service";
const model = require("../models/index");

module.exports.getCategories = async (req: Request, res: Response) => {
	try {
    const categories: typeof model.Category[] = await getCategories(req);
		return res
			.status(200)
			.json({
				status: 200,
				data: categories,
				notification: "Listes des catégories de produits",
			});
	} catch (error) {
    console.log("\nerror: ",error);
		return res.status(500).json({ error: error, notification: "Erreur système" });
	}
};

export const getCategoryByUuidHandler = async (req: Request, res: Response) => {
	try {
		const category = await getCategoryByUuid(req.params.uuid);
		return res
			.status(200)
			.json({
				status: 200,
				data: category,
				notification: "Détail de la catégory d'\article.",
			});
	} catch (error: any) {
		console.log("\n category.controller::getCategoryByUuidHandler ",error);
    return res.status(500).json({ error: error, notification: "Erreur système" });
	}
}

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

export const createCategories = async (req: Request, res: Response) => {
  try {
    const newCategories = await createCategory(req.body);
    return res.status(201).json({status: 201, data: newCategories, notification: 'Catégories enregistrées avec succès'});
  } catch (error: any) {
    console.log("\n category.controller::createCategories ",error);
    return res.status(500).json({ error: error, notification: "Erreur système" });
  }
};

export const updateCategoryHandler = async (req: Request, res: Response) => {
	const body = req.body;
	const uuid: string = req.params.uuid;
	try {
		if (!uuid) return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Veuillez rensigner la catégorie d\article à modifier.'});

		const category: typeof model.Category = await getCategoryByUuid(uuid);
		if (!category) return res.status(404).json({ status: 404, error: 'La syntaxe de la requête est erronée.', notification: 'Catégorie d\'article inconue.'});

		let value: typeof model.Category = {}
  	if (body.label && body.label != '') value['label'] = body.label;
  	if (body.code && body.code != '') value['code'] = body.code;
		if (Object.keys(value).length == 0) return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Aucune nouvelle valeur renseigné.'});
		
		const isUpdated = await updateCategory(uuid, value);
		return res.status(201).json({status: 201, data: isUpdated, notification: 'Catégorie d\'article modifiée.'});
	} catch (error: any) {
    console.log("\n category.controller::updateCategoryHandler",error);
    return res.status(500).json({ error: error, notification: "Erreur système" });
	}
}

export const importCategoryHandler = async (req: Request, res: Response) => {
	try {
		const file = req.body.file;
		if (!file.includes("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,")) 
			return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Format invalide. Le fichier n\'est pas de format XLS/XLSX.'});
		const response = await importCategory(file);
		return res.status(201).json({status: 201, data: response, notification: 'Catégorie d\'article modifiée.'});
	} catch (error: any) {
		console.log("\n category.controller::importCategoryHandler",error);
    return res.status(500).json({ error: error, notification: "Erreur système" });
	}
}