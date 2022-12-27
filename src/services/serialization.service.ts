const model = require("../models/index");

export const createMultipleSerialization =async (value: typeof model.Serialization[]) => {
  try {
    return await model.Serialization.bulkCreate(value);
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

export const getSerializationTypeByCode = async (code: string) => {
  try {
    return await model.SerializationType.findOne({
      where: { code: code }
    });
  } catch (error) {
    throw error;
  }
};

export const getSerializationBySerialNumber = async (value: string) => {
  try {
    return await model.Serialization.findOne({
      where: { serial_number: value }
    });
  } catch (error) {
    throw error;
  }
}

export const getSerializationByImei = async (value: string) => {
  try {
    return await model.Serialization.findOne({
      where: { imei: value }
    });
  } catch (error) {
    throw error;
  }
}