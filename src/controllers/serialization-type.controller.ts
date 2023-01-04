import { Request, Response } from "express";
import { getSerializationTypes } from "../services/seriliazation-type.service";
const model = require("../models/index");

export const getSerializationTypeBysHandler = async (req: Request, res: Response) => {
  try {
    const types: typeof model.SerializationType = await getSerializationTypes();
    return res.status(200).json({status: 200, data: types, notification: 'Listes des types de serialisations.'});
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error, notification: "Erreur système" });
  }
}