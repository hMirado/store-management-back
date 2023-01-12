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