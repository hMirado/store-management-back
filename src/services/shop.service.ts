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