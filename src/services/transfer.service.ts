const model = require("../models/index");

export const getTransfertStatusByCode = async (code: string) => {
  try {
    return await model.StatusTransfer.findOne({
      where: {status_code: code}
    })
  } catch (error: any) {
    console.log("\n transfer.service::getTransfertStatusByCode");
    throw new Error(error);
  }
}

export const createTransfer = async (values: typeof model.StockTransfer, _transaction: IDBTransaction | any = null) => {
  try {
    return await model.StockTransfer.create(
      values,
      { transaction: _transaction }
    )
  } catch (error: any) {
    console.log("\n transfer.service::createTransfer");
    throw new Error(error);
  }
}

export const editTransfer = async (id: number, values: typeof model.StockTransfer, _transaction: IDBTransaction | any = null) => {
  try {
    return await model.StockTransfer.create(
      values,
      { where: {stock_transfert_id: id} },
      { transaction: _transaction }
    )
  } catch (error: any) {
    console.log("\n transfer.service::editTransfer");
    throw new Error(error);
  }
}