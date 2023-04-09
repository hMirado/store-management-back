import { Role } from "../models/role.model";
import { Authorization } from "../models/authorization.model";
import { Request } from "express";
import { getPagination, getPagingData } from "../helpers/pagination";
const { Op } = require("sequelize");

export const getRoles = async (req: Request) => {
  const query = req.query
  let condition: any = {};
  if (query.search != '') condition['role_name'] = { [Op.like]: `%${query.search}%` };
  try {
    if (query.paginate && query.paginate == '1') {
      const page = (query.page && +query.page > 1) ? +query.page - 1 : 0;
      const size = req.query.size ? req.query.size : 10;
      const { limit, offset } = getPagination(page, +size);

      const roles: typeof Role[] = await Role.findAndCountAll({
        include: Authorization,
        required: false,
        where: condition,
        offset,
        limit,
        distinct: true,
        order: [
          ['role_name', 'ASC']
        ],
      });

      return getPagingData(roles, page, 10);
    } else {
      return await Role.findAll({
        include: Authorization
      })
    }
  } catch (error: any) {
    console.log("\n role.service::getRoles");
    console.log(error);
    throw new Error(error);
  }
}

export const getRoleByUuid = async (uuid: string) => {
  try {
    const role: typeof Role = await Role.findOne({
      include: Authorization,
      where: { role_uuid: uuid }
    });

    if (!role) return null;

    const authorizations = role.authorizations.map((auth: typeof Authorization) => {
      return {
        authorization_id: auth.authorization_id,
        authorization_uuid: auth.authorization_uuid,
        authorization_name: auth.authorization_name,
        authorization_key: auth.authorization_key,
        authorization_parent: auth.authorization_parent
      }
    });
    const authorizationsTree = generateAuthorizationTree(authorizations);

    const profil = {
      role_id: role.role_id,
      role_uuid: role.role_uuid,
      role_key: role.role_key,
      role_name: role.role_name,
      authorizations: authorizationsTree
    }
    return profil;
  } catch (error: any) {
    console.log("role::service>>getRoleByUuid");
    console.log(error);
    
    throw new Error(error);
  }
}

const generateAuthorizationTree = (authorizations: any[]) => {
  const map: any = {};
  const result: any[] = [];

  // 1 - map the objects by their authorization_id property
  authorizations.forEach((authorization) => {
    authorization.authorization_child = [];
    map[authorization.authorization_id] = authorization;
  });

  // 2 - create tree structure by iterating over each object and adding it as a child to its parent (if it has one)
  authorizations.forEach((authorization) => {
    if (authorization.authorization_parent !== null) {
      const parent = map[authorization.authorization_parent];
      parent.authorization_child.push(authorization);
    } else {
      result.push(authorization);
    }
  });

  return result;
}

export const getRoleById = async (id: number) => {
  try {
    return await Role.findOne({
      include: Authorization,
      where: { role_id: id }
    });
  } catch (error: any) {
    console.log("\n role.service::getRoleById");
    console.log(error);
    throw new Error(error);
  }
}