import { Request, Response } from "express";
import {User} from '../models/user.model';
import { findUserByEmailOrPhoneNumber } from '../services/user.service'
import { login, logout } from "../services/authentication.service";

export const loginHandler = async (req: Request, res: Response) => {
  try {
    const { emailOrPhoneNumber, password } = req.body;

    const user: typeof User = await findUserByEmailOrPhoneNumber(emailOrPhoneNumber);
    if (!user) return res.status(400).json({ status: 400, error: 'Ressource non trouvée', notification: 'L\'utilisateur est inexistante.'});

    const token = await login(user, password);
    delete user.password;
    if (token) {
      //return res.status(200).cookie('token', token, { maxAge: 10 * 60 * 60 * 1000, httpOnly: true }).json({status: 200, data: token, notification: 'Utilisateur connecté'});
      return res.status(200).json({status: 200, data: {token: token, user: user}, notification: 'Utilisateur connecté'});
    } else {
      return res.status(200).json({status: 200, notification: 'Mots de passe incorrecte'});
    }
  } catch (error: any) {
    console.log("authentication.controller::loginHandler",error);
    return res.status(500).json({ body: error, notification: "Erreur système" })
  }
};

export const logoutHandler = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers['authorization'];
    const isLoggedOut = await logout(authHeader as string);
    return res.status(200).json({status: 200, data: isLoggedOut, notification: 'Utilisateur déconnecté'});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ body: error, notification: "Erreur système" })
  }
};