const model = require("../models/index");

export const getTypes = async () => {
  try {
    return await model.AttributeType.findAll();
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}