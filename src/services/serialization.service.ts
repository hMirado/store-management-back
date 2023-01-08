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
    const serializations: typeof model.Serialization =  await model.Serialization.findAll(
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
    let serializationsGrouped: any[] = [];
    serializations.forEach((serialization: typeof model.Serialization ) => {
      serializationsGrouped.push(
        {
          serialization_id: serialization.serialization_id,
          serialization_uuid: serialization.serialization_uuid,
          serialization_value: serialization.serialization_value,
          attribute_serialization: serialization.attribute_serialization,
          createdAt: serialization.createdAt,
          updatedAt: serialization.updatedAt,
          fk_product_id: serialization.fk_product_id,
          fk_serialization_type_id: serialization.fk_serialization_type_id,
          fk_shop_id: serialization.fk_shop_id,
          serialization_type_label: serialization.serialization_type.label
        }
      )
    })
    const grouped = serializationsGrouped.reduce((group: typeof model.Serialization, serialization: typeof model.Serialization) => {
      const { attribute_serialization } = serialization;
      group[attribute_serialization] = group[attribute_serialization] ?? [];
      group[attribute_serialization].push(serialization);
      return group
    }, {})

    let results = [];
    for (const key in grouped) {
      results.push(grouped[key])
    }

    return results;
  } catch (error: any) {
    console.log('\nserialization.servie::getProductSerialization');
    console.log(error);
    throw new Error(error);
  }
}