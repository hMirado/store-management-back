import { Role } from "../models/role.model";
import { Request } from "express";

export const getRoles = async (req: Request) => {
  try {
    if (req.query.paginate && req.query.paginate == '1') {

    } else {
      return await Role.findAll()
    }
  } catch (error: any) {
    throw new Error(error);
  }
}