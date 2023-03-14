import { Response, Request } from "express";
import { Role } from "../models/role.model";
import { getRoles } from "../services/role.service";

export const getRolesHandler = async (req:Request, res: Response) => {
  try {
    const roles: typeof Role[] = await getRoles(req);
    return res.status(200).json({status: 200, data: roles, notification: 'Liste des rôles.'});
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ body: error, notification: "Erreur système" })
  }
}