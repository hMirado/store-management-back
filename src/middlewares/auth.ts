import { Request, Response, NextFunction } from "express";
import { findUserByToken } from '../services/user.service'
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();

export const verifyToken = async (req: Request | any, res: Response, next: NextFunction) => {
  // const token = req.body.token || req.query.token || req.headers["Authorization"];
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  try {
    if (!token) return res.status(403).json({ status: 403, error: 'Accès réfusé.', notification: 'Vous n\'avez pas accès. Veuillez vous connecter.'});
    jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await findUserByToken(token);
    res.locals.user = user;
    if (!user) return res.status(401).json({ status: 401, error: 'Votre clé d\'authentification à expiré, veuillez vous reconnecter', notification: 'Token expiré'});
  } catch (error: any) {
    return res.status(401).json({ status: 401, error: error, notification: 'Token erroné'});
  }
  
  return next();
};
