const model = require("../models/index");

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