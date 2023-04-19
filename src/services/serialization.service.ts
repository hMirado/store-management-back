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

export const getSerializationByProductShop = async (productId: number, shopId: number, isSold: boolean = false) => {
  const column = "sr.serialization_id, sr.serialization_uuid, sr.serialization_value, sr.group_id, p.product_id, s.shop_id, st.serialization_type_id, st.code, st.label";
  let query = `
    SELECT ${column} FROM serializations sr
    INNER JOIN serialization_types st ON sr.fk_serialization_type_id = st.serialization_type_id
    INNER JOIN shops s ON sr.fk_shop_id = s.shop_id
    INNER JOIN stocks sto ON sr.fk_shop_id = sto.fk_shop_id
    INNER JOIN products p ON sr.fk_product_id = p.product_id
    WHERE p.product_id = ${productId}
  `;
  try {
    query += shopId > 0 ? ` AND s.shop_id = ${shopId}` : '';
    query += ` AND sr.is_sold = ${isSold}`;
    query += ' AND sr.is_in_transfer = false';
    query += ' GROUP BY sr.serialization_id'
    
    const serializations: typeof model.Serialization =  await sequelize.query(
      query, 
      {
        type: QueryTypes.SELECT
      }
    );
    
    const grouped = serializations.reduce((result: typeof model.Serialization, item: typeof model.Serialization) => {
      const { group_id } = item;
      result[group_id] = result[group_id] ?? [];
      result[group_id].push(item);
      return result
    }, {});

    return Object.values(grouped);
  } catch (error: any) {
    console.log('\nserialization.service::getProductSerialization');
    console.log(error);
    throw new Error(error);
  }
}

export const getSerializationByProduct_Type_Value = async (productId: number, type: number, serialization: string) => {
  try {
    return await model.Serialization.findOne({
      where: {
        serialization_value: serialization,
        fk_product_id: productId,
        fk_serialization_type_id: type
      }
    });
  } catch (error: any) {
    console.log('\nserialization.service::getSerializationByProduct_Type_Value');
    console.log(error);
    throw new Error(error);
  }
}

export const updateSerializationTransfer = async (attribute: string, shopId: number, isInTransfer: boolean = false,_transaction: IDBTransaction | any = null) => {
  const newValue: any = {
    fk_shop_id: shopId,
    isInTransfer: isInTransfer
  }
  try {
    return await model.Serialization.update(
      newValue,
      { 
        where: { attribute_serialization: attribute },
        returning: true
      },
      { transaction: _transaction }
    )
  } catch (error: any) {
    console.log('\nserialization.service::updateSerializationByAttribute');
    console.log(error);
    throw new Error(error);
  }
}
