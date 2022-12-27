const model = require("../models/index");

export const getStockMovmentTypeByMovment = async (movment: string) => {
  try {
    return model.StockMovmentType.findOne({
      where: { movment: movment }
    })
  } catch (error: any) {
    throw new Error(error);
  }
}