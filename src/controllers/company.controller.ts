import { Request, Response } from "express";
const Company = require("../models/company.model");

module.exports.getCompanies = async (req: Request, res: Response) => {
  try {
    const companies: typeof Company[] = await Company.findAll();
		return res.status(200).json({status: 200, data: companies, notification: 'Listes des entreprises'});
  } catch (error) {
		return res.status(500).json({ error: error, notification: 'Erreur système'});
  }
};

module.exports.getCompanyByUuid = async (req: Request, res: Response) => {
  const uuid: string = req.params.uuid;

  if (!uuid) return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Entreprise non spécifié'});
  try {
    const company = await Company.findOne({
      where: { company_uuid: uuid }
    });
		return res.status(200).json({status: 200, data: company, notification: 'Détail de l\'entreprise'});
  } catch (error) {
		return res.status(500).json({ error: error, notification: 'Erreur système'});
  } 
};