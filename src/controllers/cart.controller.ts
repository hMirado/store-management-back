import { Request, Response } from "express";
import { generateNewCart, getCartStatus } from "../services/cart.service";

export const createCartHandler = async (req: Request, res: Response) => {
  try {
    const status = await getCartStatus('IN-PROGRESS');
    const user = res.locals.user;
    const cart = await generateNewCart(status.cart_status_id, user.user_id, req.body.shop);
    return res.status(201).json({status: 201, data: cart, notification: 'Votre session est démarré.'});
  } catch (error: any) {
    return res.status(500).json({ error: error, notification: "Erreur système!" });
  }
}