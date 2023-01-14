const model = require("../models/index");
import { HasMany, Op, QueryTypes } from "sequelize"
const sequelize = require("../config/db.config");

export const createMultipleSerialization = async (value: typeof model.Serialization[], _transaction: IDBTransaction | any = null) => {
  try {
    return await model.Serialization.bulkCreate(value, { transaction: _transaction });
  } catch (error: any) {
    console.log('\nserialization.service::createMultipleSerialization');
    console.log(error);
    throw new Error(error);
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

export const getSerializationByProductShop = async (productId: number, shopId: number, isSold: string | null = null) => {
  const column = "sr.serialization_id, sr.serialization_uuid, sr.serialization_value, sr.attribute_serialization, p.product_id, s.shop_id, st.serialization_type_id, st.code, st.label";
  let query = `
    SELECT ${column} FROM serializations sr
    INNER JOIN serialization_types st ON sr.fk_serialization_type_id = st.serialization_type_id
    INNER JOIN shops s ON sr.fk_shop_id = s.shop_id
    INNER JOIN products p ON sr.fk_product_id = p.product_id
    INNER JOIN attributes a ON sr.attribute_serialization = a.attribute_serialization
    WHERE p.product_id = ${productId} 
  `;
  try {
    query += shopId > 0 ? ` AND s.shop_id = ${shopId}` : '';
    query += (isSold && isSold != '') ? ` AND a.is_sold = ${+isSold}` : '';
    
    const serializations: typeof model.Serialization =  await sequelize.query(
      query, 
      {
        type: QueryTypes.SELECT
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
          fk_product_id: serialization.product_id,
          fk_serialization_type_id: serialization.serialization_type_id,
          fk_shop_id: serialization.shop_id,
          serialization_type_code: serialization.code,
          serialization_type_label: serialization.label
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
    console.log('\nserialization.service::getProductSerialization');
    console.log(error);
    throw new Error(error);
  }
}

export const getAttributeSerializationBySerialization = async (productId: number, type: number, serialization: number) => {
  try {
    return await model.Serialization.findOne({
      where: {
        serialization_value: serialization,
        fk_product_id: productId,
        fk_serialization_type_id: type
      }
    });
  } catch (error: any) {
    console.log('\nserialization.service::getAttributeSerializationBySerialization');
    console.log(error);
    throw new Error(error);
  }
}

export const updateSerializationShopByAttribute = async (attribute: string, shopId: number, _transaction: IDBTransaction | any = null) => {
  try {
    return await model.Serialization.update(
      { fk_shop_id: shopId },
      { where: { attribute_serialization: attribute } },
      { transaction: _transaction }
    )
  } catch (error: any) {
    console.log('\nserialization.service::updateSerializationByAttribute');
    console.log(error);
    throw new Error(error);
  }
}