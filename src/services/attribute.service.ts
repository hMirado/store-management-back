const model = require("../models/index");

export const createAttribute = async (attribute: typeof model.Attribute, _transaction: IDBTransaction | any = null) => {
  try {
    const transaction = { transaction: _transaction }
    return await model.Attribute.create(attribute, transaction)
  } catch (error) {
    throw error;
  }
};