import { Request } from "express";
import { Op } from "sequelize";
const model = require("../models/index");

export const getShopByUuidOrCode = async (value: string) => {
  try {
    return await model.Shop.findOne({
      //where: {shop_uuid: uuid}
      where: {
        [Op.or]: [
          {shop_uuid: value},
          {shop_code: value}
        ]
      }
    })
  } catch (error) {
    throw error;
  }
}

export const getShopById = async (id: number) => {
  try {
    return await model.Shop.findOne({
      where: {shop_id: id}
    })
  } catch (error) {
    throw error;
  }
}

export const getShopByStatus = async (status: boolean) => {
  try {
    return await model.Shop.findOne({
      where: {status: status}
    })
  } catch (error: any) {
    throw new Error(error);
  }
}

export const getShops = async (req: Request | null = null) => {
  let conditions: any = {};
  if (req?.query.open) {
    conditions['is_opened'] = req.query.open
  }
  try {
    return await model.Shop.findAll(
      {
        include: model.Company,
        where: conditions
      }
    );
  } catch (error: any) {
    console.error('shop.service::getShop', error)
    throw new Error(error);
  }
}

export const openShop = async (shopUuid: string, status: boolean) => {
  try {
    await model.Shop.update(
      {
        is_opened: status
      },
      {
        where: { shop_uuid: shopUuid }
      }
    );

    return await getShopByUuidOrCode(shopUuid)
  } catch (error: any) {
    console.error('shop.service::openShop', error)
    throw new Error(error);
  }
}