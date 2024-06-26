import { Request, Response } from "express";
import { startSession, endSession, sessionByUuid, userSession } from "../services/session.service";
import { getShopByUuidOrCode } from "../services/shop.service";

const model = require("../models/index");

export const startSessionHandler = async (req: Request, res: Response) => {
  const value = req.body;
  try {
    const user = res.locals.user;
    const shop: typeof model.shop = await getShopByUuidOrCode(value.shop);
    if (!shop) return res.status(400).json({ status: 400, error: 'Ressource non trouvée.', notification: 'Shop inexistante.'});
    
    const session = await startSession(value.cash_float, user.user_id, shop.shop_id);
    return res.status(201).json({status: 201, data: session, notification: 'Votre session est démarré.'});
  } catch (error: any) {
    console.log(error)
    return res.status(500).json({ error: error.toString(), notification: "Erreur système!" });
  }
}

export const endSessionHandler = async (req: Request, res: Response) => {
  const value = req.body;
  const sessionUuid = req.params.session
  try {
    if (sessionUuid) {
      const session = await sessionByUuid(sessionUuid);
      if (!session) return res.status(400).json({ status: 400, error: 'Ressource non trouvée.', notification: 'Session déjà fermée.'});
    } else {
      return res.status(400).json({ status: 400, error: 'Ressource non trouvée.', notification: 'Session déjà fermée.'});
    }
    const session = await endSession(value.cash, sessionUuid);
    return res.status(200).json({status: 200, data: session, notification: 'Votre session est fermée.'});
  } catch (error: any) {
    console.log(error)
    return res.status(500).json({ error: error.toString(), notification: "Erreur système!" });
  }
}

export const userSessionHandler = async (req: Request, res: Response) => {
  const user = res.locals.user;
  try {
    const session = await userSession(user.user_id);
    const notification = session ? 'Vous avez une session ouverte.' : 'Vous n\'avez pas de session en cours.';
    return res.status(200).json({status: 200, data: session, notification });
  } catch (error: any) {
    console.log(error)
    return res.status(500).json({ error: error.toString(), notification: "Erreur système!" });
  }
}