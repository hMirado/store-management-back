import { Request, Response } from "express";
import { getShops, getShopByStatus, getShopByUuidOrCode, openShop, getShopsByUser } from "../services/shop.service";
import { findUserByUuid } from "../services/user.service";
const model = require("../models/index");

/**
 * @description get all shops
 */
module.exports.getShops = async (req: Request, res: Response) => {
	try {
		const shops: typeof model.Shop[] = await getShops(req);
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

export const getShopByStatusHandler = async (req: Request, res: Response) => {
	const status = req.query.status as string
	try {
		const shop: typeof model.Shop = await getShopByStatus(Boolean(status))
		return res.status(200).json({ status: 200, data: shop, notification: 'Liste des boutiques.'});
	} catch (error: any) {
		return res.status(500).json({ status: 500, error: error.toString(), notification: 'Erreur système'});
	}
}

export const openShopHandler = async (req: Request, res: Response) => {
	try {
		const shopUuid = req.params.uuid;
		const status = req.body.status;
		const notification = status ? 'ouvert' : 'fermé';
		const shop: typeof model.Shop = await getShopByUuidOrCode(shopUuid);
		if (!shop)  return res.status(400).json({ status: 400, error: 'Ressource non trouvée', notification: 'Shop inexistante.'});
		if (shop && shop.is_opened == status) return res.status(200).json({ status: 200, data: shop, notification: `shop déjà ${notification}`});
		const update = await openShop(shopUuid, status); 
		return res.status(201).json({status: 201, data: {status: update}, notification: `shop ${notification}`});
	} catch (error: any) {
		return res.status(500).json({ status: 500, error: error.toString(), notification: 'Erreur système'});
	}
}


export const getShopByUserHandler = async (req: Request, res: Response) => {
	try {
		const userUuid: string = req.params.user;
    if (!userUuid) return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Utilisateur non spécifié.'});

    const user = await findUserByUuid(userUuid);
    if (!user) return res.status(404).json({ status: 404, error: 'La syntaxe de la requête est erronée.', notification: 'Utilisateur inexistant.'});
		const shops = await getShopsByUser(user.user_id);
		return res.status(200).json({status: 200, data: shops, notification: `Shop affecté a l'utilisateur: ${user.first_name} ${user.last_name}`});
	} catch (error: any) {
		return res.status(500).json({ status: 500, error: error.toString(), notification: 'Erreur système'});
	}
}