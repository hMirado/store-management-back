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

    return await getShopByUuid(shopUuid)
  } catch (error: any) {
    console.error('shop.service::openShop', error)
    throw new Error(error);
  }
}