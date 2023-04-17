const model = require("../models/index");
import { Request } from "express";

export const createPrice = async (price: typeof model.Price, transaction: IDBTransaction | any = null) => {
  try {
    return await model.Price.create(
      price,
      transaction
    )
  } catch (error: any) {
    console.log('\price.servie::createPrice');
    console.log(error);
    throw new Error(error);
  }
}

export const createMuliplePrice = async (prices: typeof model.Price[], transaction: IDBTransaction | any = null) => {
  try {
    return await model.Price.bulkCreate(
      prices,
      transaction
    )
  } catch (error: any) {
    console.log('\price.servie::createPrice');
    console.log(error);
    throw new Error(error);
  }
}

export const updatePrice = async (productId: number, productUuid: string, prices: any) => {
  const fk_product_id = productId;  
  try {
    const isUpdated =  await model.Price.update(
      prices,
      {
        where: {
          fk_product_id: fk_product_id
        }
      }
    ).then(async() => { return await getPrice(productUuid) });
    return isUpdated;
  } catch (error: any) {
    console.log('\price.servie::updatePrice');
    console.log(error);
    throw new Error(error);
  }
}

export const getPrice = async (productId: string, shop: string = '') => {
  let condition: any = {
    fk_product_id: productId
  }
  if (shop && shop != '') condition['fk_shop_id'] = shop;
  try {
    return await model.Price.findAll({
      where: condition,
      include: [
        {model: model.Product},
        {model: model.Shop}
      ]
    })
  } catch (error: any) {
    console.log('\price.servie::getPrice');
    console.log(error);
    throw new Error(error);
  }
}