import { Request, Response } from "express";

export const getImageHandler = async (req: Request, res: Response) => {
  try {
    const link = `./src/uploads/images/${req.params.type}/${req.params.path}`;
    return res.download(link)
  } catch (error) {
    console.error('product.controller::removeImageHandler', error);
    return res.status(500).json({ error: error, notification: 'Erreur système'});
  }
}