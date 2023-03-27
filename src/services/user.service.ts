import { User } from '../models/user.model';
import { UserShop } from "../models/user-shop.model";
const bcrypt = require('bcryptjs');
const model = require("../models/index");
const { Op } = require("sequelize");

export const createUser = async (first_name: string, last_name: string, email: string, phone_number: string, password: string, fk_role_id: number) => {
  try {
    const encryptedPassword = await bcrypt.hash(password, 10);
    const user: typeof User = {
      first_name,
      last_name,
      email: email,
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
        { 
          model: model.Shop
        },
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

export const findUserByEmail =async (email: string) => {
  try {
    return await User.findOne({
      attributes: { exclude: ['token', 'password'] },
      include: [
        { 
          model: model.Shop
        },
        {
          model: model.Role,
          include: {
            model: model.Authorization
          }
        }
      ],
      where: {
        email: email
      }
    })
  } catch (error: any) {
    throw error
  }
}

export const findUserByPhone =async (phone: string) => {
  try {
    return await User.findOne({
      attributes: { exclude: ['token', 'password'] },
      include: [
        { 
          model: model.Shop
        },
        {
          model: model.Role,
          include: {
            model: model.Authorization
          }
        }
      ],
      where: {
        phone_number: phone
      }
    })
  } catch (error: any) {
    throw error
  }
}

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

export const findUserById = async (id: number) => {
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
      where: { user_id: id }
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

export const addUserShop = async (value: any) => {
  try {
    return await UserShop.bulkCreate(
      value,
      {
        updateOnDuplicate: ["user_id", "shop_id"],
      }
    );
  } catch (error: any) {
    console.log("\n user.service::addUserShop");
    throw new Error(error);
  }
}

export const updateUserShop = async (user: number, newShop: number[]) => {
  try {
    return await UserShop.update(
      { is_current_shop: 0 },
      { 
        where: {
          user_id: user
        },
        returning: true,
        plain: true
      }
    );
  } catch (error: any) {
    console.log("\n user.service::updateUserShop");
    throw new Error(error);
  }
}

export const deleteUserShop = async (user: number) => {
  try {
    return await UserShop.destroy({
      where: {user_id: user}
    });
  } catch (error: any) {
    console.log("\n user.service::updateUserShop");
    throw new Error(error);
  }
}