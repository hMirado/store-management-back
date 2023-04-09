import { Response, Request } from "express";
import { Role } from "../models/role.model";
import { getRoles, getRoleByUuid } from "../services/role.service";

export const getRolesHandler = async (req:Request, res: Response) => {
  try {
    const roles: typeof Role[] = await getRoles(req);
    return res.status(200).json({status: 200, data: roles, notification: 'Liste des rôles.'});
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ body: error, notification: "Erreur système" })
  }
}

export const getRoleByUuidHandler = async (req:Request, res: Response) => {
  try {
    const role: typeof Role = await getRoleByUuid(req.params.uuid);
    if (!role) return res.status(404).json({ status: 404, error: 'La syntaxe de la requête est erronée.', notification: 'Profil inexistant.'});
    
    return res.status(200).json({status: 200, data: role, notification: 'Détail du profil.'});
  } catch (error: any) {
    console.log("role::controller>>getRoleByUuidHandler", getRoleByUuidHandler);
    return res.status(500).json({ body: error, notification: "Erreur système" })
  }
}