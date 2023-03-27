import { Response, Request } from "express";
import { IGetUserAuthInfoRequest } from "../modules/my-request";
import { 
  createUser, 
  findUserByUuid, 
  findUserById,
  addUserShop,
  updateUserShop,
  deleteUserShop,
  findUserByEmail,
  findUserByPhone
} from "../services/user.service";
import { User } from "../models/user.model";
import { Shop } from "../models/shop.model";
import { generateId } from "../helpers/helper";
import { authorization } from "../config/constants";
import { getShopById } from "../services/shop.service";
import { UserShop } from "models/user-shop.model";

export const createUserHandler = async (req: IGetUserAuthInfoRequest, res: Response) => {
  const { first_name, last_name, email, phone_number, fk_role_id } = req.body;
  const password: string = generateId();
  try {
    // const isAuthorized = verifyAuthorization(req.user.role.authorizations, authorization.PAGE_ELEMENT_ADD_NEW_USER);
    // if (!isAuthorized) return res.status(403).json({ status: 403, error: 'Accès réfusé.', notification: "Vous n'êtes pas autorisé à effectuer cete action."});

    if (!(fk_role_id && first_name && last_name && phone_number))
      res.status(400).send({status: 404, notification: 'Tous les champs sont requises.'});

    if (email) {      
      const userByEmail: typeof User = await findUserByEmail(email);
      if (userByEmail) return res.status(409).send("L'email est déjà utilisé.");
    }

    const userByPhone: typeof User = await findUserByPhone(phone_number);
    if (userByPhone) return res.status(409).send("Numéro télephone est déjà utilisé.");

    const userCreated: typeof User = await createUser(first_name, last_name, email||null, phone_number, password, fk_role_id);
    if (userCreated.user_uuid) {
      const user: typeof User = await findUserByUuid(userCreated.user_uuid);
      user['password'] = password
      return res.status(201).json({status: 201, data: user, notification: 'Utilisateur créé.'});
    }
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ body: error, notification: "Erreur système" })
  }
};

export const findUserByUuidHandler = async (req: Request, res: Response) => {
  try {
    const uuid: string = req.params.uuid;
    if (!uuid) return res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Utilisateur non spécifié.'});

    const user: typeof User = await findUserByUuid(uuid);
    if (!user) return res.status(404).json({ status: 404, error: 'La syntaxe de la requête est erronée.', notification: 'Utilisateur inexistant.'});

    return res.status(200).json({status: 200, data: user, notification: 'Détail de l\'tilisateur'});
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ body: error, notification: "Erreur système" })
  }
};

export const addUserShopHandler = async (req: Request, res: Response) => {
  const userId: number = req.body.user;
  const shops: number[] = req.body.shops;
  try {
    const user: typeof User = await findUserById(userId);
    if (!user) return res.status(404).json({ status: 404, error: 'La syntaxe de la requête est erronée.', notification: 'Utilisateur inexistant.'});
    const values: any = [];
    for (const id of shops) {
      const shop: typeof Shop = await getShopById(id);
      if (!shop) return res.status(404).json({ status: 404, error: 'La syntaxe de la requête est erronée.', notification: 'Un des shops est inexistant.'});
      values.push({user_id: userId, shop_id: id});
    }
    const userShop: typeof UserShop = await addUserShop(values);
    return res.status(201).json({status: 200, data: userShop, notification: 'Boutique ajouté à l\'utilisateur'});
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ body: error, notification: "Erreur système" })
  }
}
 
export const updateUserShopHandler = async (req: Request, res: Response) => {
  const userId: number = req.body.user;
  const shops: number[] = req.body.shops;
  try {
    const user: typeof User = await findUserById(userId);
    if (!user) return res.status(404).json({ status: 404, error: 'La syntaxe de la requête est erronée.', notification: 'Utilisateur inexistant.'});
    
    await deleteUserShop(userId);

    const values: any = [];
    for (const id of shops) {
      const shop: typeof Shop = await getShopById(id);
      if (!shop) return res.status(404).json({ status: 404, error: 'La syntaxe de la requête est erronée.', notification: 'Un des shops est inexistant.'});
      values.push({user_id: userId, shop_id: id, is_current_shop: true});
    }
    const userShop: typeof UserShop = await addUserShop(values);
    return res.status(201).json({status: 200, data: userShop, notification: 'Boutique ajouté à l\'utilisateur'});
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ body: error, notification: "Erreur système" })
  }
}