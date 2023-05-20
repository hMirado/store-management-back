const model = require("../models/index");
import { Op, QueryTypes } from "sequelize"
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

export const getSerializationByProductShop = async (productId: number, shopId: number, search: string = '', isSold: boolean = false) => {
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
    query += search != '' ? ` AND sr.serialization_value like '%${search}%'` : '';
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

export const getSerializationByGroup = async (group: string) => {
  try {
    return await model.Serialization.findOne({
      where: {
        group_id: group,
      }
    });
  } catch (error: any) {
    console.log('\nserialization.service::getSerializationByGroup', error);
    throw new Error(error);
  }
}

export const findAllSerializationByGroup = async (groups: string[]) => {
  try {
    const serializations =  await model.Serialization.findAll({
      include: model.SerializationType,
      where: {
        group_id: {
          [Op.in]: groups
        },
      }
    });

    let groupedSerialization: any = {};
    for (const obj of serializations) {
      if (!groupedSerialization[obj.group_id]) {
        groupedSerialization[obj.group_id] = [];
      }
      
      groupedSerialization[obj.group_id].push(obj);
    }
    /*serializations.forEach((serialization: typeof model.Serialization) => {
      const {group_id} = serialization;
      if (groupedSerialization[group_id]) groupedSerialization[group_id].push(serialization);
      else groupedSerialization[group_id] = serialization;
    });*/

    return Object.values(groupedSerialization);
  } catch (error: any) {
    console.log('\nserialization.service::getSerializationByGroup', error);
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

export const updateSerializationInTransfer = async (groupId: string[], transferId: number, _transaction: IDBTransaction | null = null) => {
  try {
    return await model.Serialization.update(
      {
        is_in_transfer: 1
      },
      {
        where: {
          group_id: { [Op.in]: groupId }
        },
       transaction: _transaction 
      }
    );
  } catch (error: any) {
    console.log('\nserialization.service::updateSerializationByAttribute', error);
    throw new Error(error);
  }
}

export const updateSerializationShop = async (groupId: string[], shop: number, _transaction: IDBTransaction | null = null) => {
  try {
    return await model.Serialization.update(
      {
        is_in_transfer: 0,
        fk_shop_id: shop,
      },
      {
        where: {
          group_id: { [Op.in]: groupId }
        },
       transaction: _transaction 
      }
    )
  } catch (error: any) {
    console.log('\nserialization.service::updateSerializationByAttribute', error);
    throw new Error(error);
  }
}