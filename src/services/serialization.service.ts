const model = require("../models/index");
import { Op } from "sequelize"

export const createMultipleSerialization = async (value: typeof model.Serialization[], _transaction: IDBTransaction | any = null) => {
  try {
    return await model.Serialization.bulkCreate(value, { transaction: _transaction });
  } catch (error) {
    throw error
  }
};

export const createSerialization =async (value: typeof model.Serialization) => {
  try {
    return await model.Serialization.create(value);
  } catch (error) {
    throw error
  }
};

export const getSerializationByValue = async (value: string, type: number) => {
  try {
    return await model.Serialization.findAll({
      where: {
        [Op.and]:[ 
          { serialization_value: `%${value}` },
          { fk_serialization_type_id: type }
        ]
      }
    });
  } catch (error) {
    throw error;
  }
}

export const getSerializationByProductShop = async (productId: number, shopId: number) => {
  let condition = {}
  if (shopId > 0) {
    condition = {shop_id: shopId}
  }
  try {
    return await model.Serialization.findAll(
      {
        include: [
          {
            model: model.SerializationType
          },
          {
            model: model.Shop,
            where: condition
          },
          {
            model: model.Product,
            where: {
              product_id: productId
            }
          }
        ]
      }
    )
  } catch (error: any) {
    console.log('\nserialization.servie::getProductSerialization');
    console.log(error);
    throw new Error(error);
  }
}