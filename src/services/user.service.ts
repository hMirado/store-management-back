import { User } from '../models/user.model';
import { UserShop } from "../models/user-shop.model";
const bcrypt = require('bcryptjs');
const model = require("../models/index");
const { Op } = require("sequelize");
import { Request } from "express";
import { getPagination, getPagingData } from '../helpers/pagination';
import { QueryTypes } from 'sequelize';
const sequelize = require("../config/db.config");
import { generateId } from '../helpers/helper';

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
      attributes: { exclude: ['token', 'password'] },
      include: [
        { model: model.Shop },
        {
          model: model.Role,
          include: {
            model: model.Authorization
          }
        }
      ],
      where: { user_uuid: uuid },
      paranoid: false,
    })
  } catch (error: any) {
    throw error
  }
};

export const queryFindUserWithShop = async (uuid: string) => {
  const query = `
    SELECT u.user_id , u.user_uuid , u.first_name , u.last_name , u.email , u.phone_number , u.fk_role_id , 
      s.shop_id , s.shop_uuid , s.shop_code , s.shop_name , s.shop_location , s.shop_box ,
      r.role_id , r.role_uuid , r.role_key , r.role_name 
    FROM (
        SELECT * FROM users AS _user WHERE _user.user_uuid = '${uuid}' LIMIT 1
    ) AS u
    LEFT OUTER JOIN (
      user_shops us
      INNER JOIN shops s ON s.shop_id  = us.shop_id AND (us.deletedAt IS NULL OR us.updatedAt > us.deletedAt)
    )  ON us.user_id = u.user_id AND s.deletedAt IS NULL
    LEFT OUTER JOIN roles AS r ON u.fk_role_id = r.role_id
  `;
  try {
    const user =  await sequelize.query(
      query, 
      {
        type: QueryTypes.SELECT
      }
    );

    if (user.length == 0) return null;
    const shops = user?.map((x: any) => {
      return {
        shop_id: x.shop_id,
        shop_uuid: x.shop_uuid,
        shop_code: x.shop_code,
        shop_name: x.shop_name,
        shop_location: x.shop_location,
        shop_box: x.shop_box,
      }
    })
    let userInfo = {
      user_id: user[0].user_id,
      user_uuid: user[0].user_uuid,
      first_name: user[0].first_name,
      last_name: user[0].last_name,
      email: user[0].email,
      phone_number: user[0].phone_number,
      fk_role_id: user[0].fk_role_id,
      role: {
        role_id: user[0].role_id,
        role_uuid: user[0].role_uuid,
        role_key: user[0].role_key,
        role_name: user[0].role_name,
      },
      shops: shops
    };
    return userInfo;
  } catch (error: any) {
    console.log("\n user.service::queryFindUserWithShop");
    throw new Error(error);
  }
}

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

export const findAllUser = async (req: Request, role: string = '', shop: string = '') => {
  const query = req.query
  let condition: any = {}
  if (query.search) {
    const search = query.search
    condition[Op.or] = [
      {
        first_name: { [Op.like]: `%${search}%` }
      },
      {
        last_name: { [Op.like]: `%${search}%` }
      }
    ];
  }
  if (role != '') condition['fk_role_id'] = + role;

  let shopCondition: any = {};
  if (shop != '') shopCondition['shop_uuid']  = shop
  try {
    if (req.query.paginate && req.query.paginate == '1') {
      const page = (req.query.page && +req.query.page > 1) ? +req.query.page - 1 : 0;
      const size = req.query.size ? req.query.size : 10;
      const { limit, offset } = getPagination(page, +size);
      const categories: typeof User[] =  await User.findAndCountAll({
        attributes: { exclude: ['token', 'password'] },
        include: [
          { 
            model: model.Shop,
            where : shopCondition,
            required: true
          },
          {
            model: model.Role,
            required: false
          }
        ],
        where: condition,
        offset,
        limit,
        distinct: true,
        order: [
          ['last_name', 'ASC'],
          ['first_name', 'ASC']
        ],
      })
      return getPagingData(categories, page, 10);
    } else {
      return await User.findAll({
        attributes: { exclude: ['token', 'password'] },
        include: [
          { 
            model: model.Shop,
            where : shopCondition
          },
          {
            model: model.Role,
            include: {
              model: model.Authorization
            }
          }
        ],
        where: condition
      });
    }
  } catch (error: any) {
    console.log("\n user.service::findAllUser");
    console.log(error);
    throw new Error(error);
  }
}

export const countUser = async () => {
  try {
    return await User.count();
  } catch (error: any) {
    console.log("\n user.service::countUser");
    console.log(error);
    throw new Error(error);
  }
}

export const updateUser = async (req: Request) => {
  const user = req.body;
  const userUuid = req.body.user_uuid;
  try {
    delete user.user_uuid;
    return await User.update(
      user,
      {
        where: {
          user_uuid: userUuid
        }
      }
    );
  } catch (error: any) {
    console.log("\n user.service::updateUser");
    console.log(error);
    throw new Error(error);
  }
}

export const resetPassword = async (userUuid: string) => {
  const newPassword: string = generateId();
  const encryptedPassword = await bcrypt.hash(newPassword, 10);
  try {
    const isReseted = await User.update(
      {
        password: encryptedPassword,
        token: null,
        is_new: true
      },
      {
        where: {
          user_uuid: userUuid
        }
      }
    )
    return { newPassword: newPassword, isReseted: isReseted[0] };
  } catch (error: any) {
    console.log("\n user.service::resetPassword", error);
    throw new Error(error);
  }
}

export const updatePassword = async (userUuid: string, password: string) => {
  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    return await User.update(
      {
        password: encryptedPassword,
        is_new: false
      },
      {
        where: {
          user_uuid: userUuid
        }
      }
    )
  } catch (error: any) {
    console.log("\n user.service::resetPassword", error);
    throw new Error(error);
  }
}