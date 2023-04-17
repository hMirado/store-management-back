const model = require("../models/index");

export const createAttribute = async (attribute: typeof model.Attribute, _transaction: IDBTransaction | any = null) => {
  try {
    const transaction = { transaction: _transaction }
    return await model.Attribute.create(attribute, transaction)
  } catch (error) {
    throw error;
  }
};

export const createMultipleAttribute = async (value: typeof model.Attribute[], _transaction: IDBTransaction | any = null) => {
  try {
    return await model.Attribute.bulkCreate(value, { transaction: _transaction });
  } catch (error) {
    throw error
  }
};