import { Request, Response } from "express";
import { getShopByStatus } from "../services/shop.service";
const model = require("../models/index");

/**
 * @description get all shops
 */
module.exports.getShops = async (req: Request, res: Response) => {
	try {
		const shops: typeof model.Shop[] = await model.Shop.findAll({
			include: model.Company,
		});
		return res.status(200).json({status: 200, data: shops, notification: 'Listes des boutiques'});
	} catch (error) {
		return res.status(500).json({ status: 500, error: error, notification: 'Erreur système' });
	}
};

/**
 * @description get single shop by uuid
 */
module.exports.getShopByUuid = async (req: Request, res: Response) => {
	const uuid: string = req.params.uuid;

	if (!uuid) return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Shop non spécifié'});
	try {
		const shop: typeof model.Shop = await model.Shop.findOne({
			include: model.Company,
      where: { shop_uuid: uuid }
		});
		return res.status(200).json({ status: 200, data: shop, notification: 'Détail de la boutique' });
	} catch (error) {
		return res.status(500).json({ status: 500, error: error, notification: 'Erreur système' });
	}
};

/**
 * @description create a new shop
 */
module.exports.createShop = async (req: Request, res: Response) => {
	try {
		const shop = await model.Shop.create({
			shop_name: req.body.shop_name,
			shop_location: req.body.shop_location,
			shop_box: req.body.shop_box,
			city: req.body.city,
			status: req.body.status,
			companyCompanyId: req.body.companyCompanyId
		});
		return res.status(200).json({status: 200, data: shop, notification: 'Boutique créer avec succès'});
	} catch (error) {
		return res.status(500).json({ error: error, notification: 'Erreur système'});
	}
}

/**
 * @description: Update shop detail
 */
module.exports.updateShop = async (req: Request, res: Response) => {
	const uuid: string = req.params.uuid;
	if (!uuid) return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Shop non spécifié'});

	try {
		const shop: typeof model.Shop = await model.Shop.findOne({
			include: model.Company,
      where: { shop_uuid: uuid }
		});

		if (shop == null)  return res.status(400).json({ status: 400, error: 'Ressource non trouvée', notification: 'La boutique que vous essaié de modifier n\'existe pas.'});
		const update: typeof model.Shop = await model.Shop.update(
			{
				shop_name: req.body.shop_name,
				shop_location: req.body.shop_location,
				shop_box: req.body.shop_box,
				city: req.body.city,
			},
			{
				where: { shop_uuid: uuid }
			}
		);

		return res.status(200).json({status: 200, data: update, notification: 'Boutique mis à jour avec succès'});
	} catch (error) {
		return res.status(500).json({ status: 500, error: error, notification: 'Erreur système'});
	}
}

/**
 * @description updates shop status
 */
module.exports.updateShopStatus = async (req: Request, res: Response) => {
	const uuid: string = req.params.uuid;
	if (!uuid) return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Shop non spécifié'});

	try {
		const shop: typeof model.Shop = await model.Shop.findOne({
			include: model.Company,
      where: { shop_uuid: uuid }
		});

		if (shop == null)  return res.status(400).json({ status: 400, error: 'Ressource non trouvée', notification: 'La boutique que vous essaié de modifier n\'existe pas.'});
		const update: typeof model.Shop = await model.Shop.update(
			{
				status: req.body.status
			},
			{
				where: { shop_uuid: uuid }
			}
		);

		return res.status(200).json({status: 200, data: update, notification: 'Status de la boutique mise à jour avec succès'});
	} catch (error) {
		return res.status(500).json({ status: 500, error: error, notification: 'Erreur système'});
	}
}

/**
 * @description delete shop by uuid
 */
module.exports.deleteShop =async (req: Request, res: Response) => {
	const uuid: string = req.params.uuid;
	if (!uuid) return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Shop non spécifié'});

	try {
		const shop: typeof model.Shop = await model.Shop.findOne({
			include: model.Company,
      where: { shop_uuid: uuid }
		});

		if (shop == null)  return res.status(400).json({ status: 400, error: 'Ressource non trouvée', notification: 'La boutique que vous essaié de modifier n\'existe pas.'});

		const deleteShop: typeof model.Shop = await model.Shop.destroy({where: { shop_uuid: uuid }});
		return res.status(200).json({status: 200, data: deleteShop, notification: 'Boutique supprimée'});
	} catch (error) {
		return res.status(500).json({ status: 500, error: error, notification: 'Erreur système'});
	}
}

export const getShopByStatusHandler =async (req: Request, res: Response) => {
	const status = req.query.status as string
	try {
		const shop: typeof model.Shop = await getShopByStatus(Boolean(status))
		return res.status(200).json({ status: 200, data: shop, notification: 'Liste des boutiques.'});
	} catch (error) {
		return res.status(500).json({ status: 500, error: error, notification: 'Erreur système'});
	}
}