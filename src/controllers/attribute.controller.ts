import { Request, Response } from "express";
import { getProductByCode } from "../services/product.service";
import { createAttribute } from "../services/attribute.service";
const model = require("../models/index");

export const createAttributeHandler = async (req: Request, res: Response) => {
  try {
    const product: typeof model.Product = await getProductByCode(req.body.product);
    if (!product) return res.status(404).json({status: 404, notification: 'Produit inéxitant'});

    const newAttribures: typeof model.Attribute = {
      camera: req.body.camera ? req.body.camera : null,
      graphics_card: req.body.graphics_card ? req.body.graphics_card : null,
      processor: req.body.processor ? req.body.processor : null,
      ram: req.body.ram ? req.body.ram : null,
      storage: req.body.storage ? req.body.storage : null,
      storage_type: req.body.storage_type ? req.body.storage_type : null,
      serialization_uuid: req.body.serialization_uuid,
      fk_product_id: product.product_id
    }
    
    const results: typeof model.Attribute = await createAttribute(newAttribures);
    return res.status(201).json({status: 201, data: results, notification: 'Attributs des produits ajoutés'});
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error, notification: "Erreur système" });
  }
}