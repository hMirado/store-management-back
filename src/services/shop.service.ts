const model = require("../models/index");

export const getShopByUuid = async (uuid: string) => {
  try {
    return await model.Shop.findOne({
      where: {shop_uuid: uuid}
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

export const getShop = async () => {
  try {
    return await model.Shop.findAll();
  } catch (error: any) {
    console.error('shop.service::getShop', error)
    throw new Error(error);
  }
}