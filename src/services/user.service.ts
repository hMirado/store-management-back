import { User } from '../models/user.model';
const bcrypt = require('bcryptjs');
const model = require("../models/index");
const { Op } = require("sequelize");

export const createUser = async (first_name: string, last_name: string, email: string, phone_number: string, password: string, fk_role_id: number) => {
  try {
    const encryptedPassword = await bcrypt.hash(password, 10);
    const user: typeof User = {
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
      phone_number: phone_number,
      fk_role_id
    };
    return await User.create(user);
  } catch (error: any) {
    throw error;
  }
};

export const findUserByEmailOrPhoneNumber = async (value: string) => {
  try {
    return await User.findOne({
      attributes: { exclude: ['token'] },
      include: [
        { model: model.Shop },
        {
          model: model.Role,
          include: {
            model: model.Authorization
          }
        }
      ],
      where: {
        [Op.or]: [
          { email: value },
          { phone_number: value }
        ]
      }
    })
  } catch (error: any) {
    throw error
  }
};

export const findUserByUuid = async (uuid: string) => {
  try {
    return await User.findOne({
      attributes: { exclude: ['token'] },
      include: [
        { model: model.Shop },
        {
          model: model.Role,
          include: {
            model: model.Authorization
          }
        }
      ],
      where: { user_uuid: uuid }
    })
  } catch (error: any) {
    throw error
  }
};

export const findUserByToken = async (token: string) => {
  try {
    return await User.findOne({attributes: { exclude: ['token'] },
      include: [
        { model: model.Shop },
        {
          model: model.Role,
          include: {
            model: model.Authorization
          }
        }
      ],
      where: { token: token }
    })
  } catch (error: any) {
    throw error
  }
}