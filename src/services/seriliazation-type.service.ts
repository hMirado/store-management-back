const model = require("../models/index");

export const getSerializationTypes = async () => {
  try {
    return await model.SerializationType.findAll();
  } catch (error) {
    throw error;
  }
};

export const getSerializationTypeByCode = async (code: string) => {
  try {
    return await model.SerializationType.findOne({
      where: { code: code }
    });
  } catch (error) {
    throw error;
  }
};