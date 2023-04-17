import { Request, Response } from "express";
import { getTypes } from "../services/attribute-type.service"
const model = require("../models/index");

export const getTypeHandler = async (req: Request, res: Response) => {
  try {
    const types: typeof model.AttributesType = await getTypes();
    return res.status(200).json({status: 200, data: types, notification: 'Liste des types d\'attributs'});
  } catch (error: any) {
    console.log(error)
    return res.status(500).json({ error: error, notification: "Erreur système" });
  }
}
