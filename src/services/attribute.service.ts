const model = require("../models/index");

export const createAttribute = async (attribute: typeof model.Attribute) => {
  try {
    return await model.Attribute.create(
      attribute, 
      {
        updateOnDuplicate: ["serialization_uuid"]
      }
    )
  } catch (error) {
    throw error;
  }
};