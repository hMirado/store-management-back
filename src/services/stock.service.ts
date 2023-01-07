const XLSX = require('xlsx');
const sequelize = require("../config/db.config");
const model = require("../models/index");
import { Request } from "express";
import { toLowerKeys } from "../helpers/format";
import { Buffer } from "buffer";
import { getPagination, getPagingData } from "../helpers/pagination";

export const getStockByIdAndShop = async (product: number, shop: number) => {
  try {
    return await model.Stock.findOne({
      where: {
        fk_product_id: product,
        fk_shop_id: shop
      }
    })
  } catch (error: any) {
    throw error;
  }
};

// export const importStock = async (req: Request, shopId: number, movmentId: number) => {
//   const transaction = await sequelize.transaction();
  
//   const bufferExcel =  Buffer.from(req.body.file.toString().replace("data:@file/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", ""),'base64');
//   const workbook = XLSX.read(bufferExcel, { type: 'buffer' });
//   const sheetNamesList = workbook.SheetNames;
//   const excelStockData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNamesList[0]]);
//   try {
//     // SequelizeValidationError
//     // SequelizeUniqueConstraintError
//     var serializations: typeof model.Serialization[] = [];
//     var stocks: typeof model.Stock[] = [];
//     var stockMovement: typeof model.StockMovement[] = [];

//     for (const excelData of excelStockData) {
//       let value = toLowerKeys(excelData);

//       const product: typeof model.Product = await getProductByCode(value.code_product);
//       if (!product) continue;
//       if ((!value.serial_number || value.serial_number == '') && (!value.imei || value.imei == '') && product.is_serializable) {
//         return {error: true, message: 'Numéro de série et IMEI non rensegné.',value}
//       }

//       if (((value.imei && value.imei !== '') || (value.serial_number && value.serial_number !== '')) && product.is_serializable) {
//         let serialization: typeof model.Serialization = { fk_product_id: product.product_id };
//         if (value.serial_number && value.serial_number !== '') {
//           const serial_number: typeof model.Serialization = await getSerializationBySerialNumber(value.serial_number)
//           if (!serial_number) serialization.serial_number = value.serial_number;
//         }
//         if (value.imei && value.imei !== '') {
//           const imei: typeof model.Serialization = await getSerializationByImei(value.imei)
//           if (!imei) serialization.imei = value.imei;
//         } 
//         serializations.push(serialization);
//       }

//       const stockData: typeof model.Stock = await getStockByIdAndShop(product.product_id, shopId);
//       if (stockData && stocks.map(x => x.fk_shop_id)[0] == stockData.fk_product_id && stocks.map(x => x.fk_product_id)[0] == stockData.shopId) {
//         const stock = {
//           quantity: stockData.quantity + value.quantity,
//           fk_shop_id: shopId,
//           fk_product_id: product.product_id
//         };
//         stocks.push(stock);
//       } else {
//         if (stocks.map(stock => stock.fk_product_id)[0] == product.product_id && stocks.map(stock => stock.fk_shop_id)[0] == shopId) {
//           stocks.map(stock => stock.quantity += value.quantity)
//         } else {
//           const stock = {
//             quantity: value.quantity,
//             fk_shop_id: shopId,
//             fk_product_id: product.product_id
//           };
//           stocks.push(stock);
//         }
//       }

//       stockMovement.push(
//         {
//           quantity: value.quantity,
//           fk_shop_id: shopId,
//           fk_product_id: product.product_id,
//           fk_stock_movment_type_id: movmentId
//         }
//       )

//       /*if (((value.imei && value.imei !== '') || (value.serial_number && value.serial_number !== '')) && product.is_serializable) {
//         let serialization: typeof model.Serialization = {
//           fk_product_id: product.product_id
//         };
//         if (value.serial_number && value.serial_number !== '') {
//           const serializationType = await getSerializationTypeByCode('SERIAL_NUMBER');
//           serialization.serial_number = value.serial_number;
//           //serialization.fk_serialization_type_id = serializationType.serialization_type_id;
//           await model.Serialization.create(serialization,{ transaction: transaction });
//         }
        
//         if (value.imei && value.imei !== '') {
//           const serializationType = await getSerializationTypeByCode('IMEI');
//           serialization.imei = value.imei;
//           //serialization.fk_serialization_type_id = serializationType.serialization_type_id;
//           await model.Serialization.create(serialization,{ transaction: transaction });
//         }
//       }

//       const stock: typeof model.Stock = await model.Stock.findOne({
//         limit: 1,
//         lock: false,
//         transaction,
//         where: {
//           fk_product_id: product.product_id,
//           fk_shop_id: shopId
//         }
//       })
      
//       if (stock) {  
//         const conditions = { 
//           fk_product_id: product.product_id,
//           fk_shop_id: shopId
//         };
//         await updateStock(stock.quantity + value.quantity, conditions, transaction)
//       } else {
//         await addStock({
//           quantity: value.quantity,
//           fk_shop_id: shopId,
//           fk_product_id: product.product_id
//         }, transaction)
//       }
    
//       await addStockMovment({
//         quantity: value.quantity,
//         fk_shop_id: shopId,
//         fk_product_id: product.product_id,
//         fk_stock_movment_type_id: movmentId
//       }, transaction);
//       */
//     }
    
//     await model.Serialization.bulkCreate(serializations);
//     await model.Stock.bulkCreate(
//       stocks,
//       {
//         updateOnDuplicate: ["fk_shop_id", "fk_product_id"],
//         transaction
//       }
//     );
//     await model.StockMovment.bulkCreate(stockMovement);

//     await transaction.commit();
//   } catch (error: any) {
//     console.log(error);
    
//     await transaction.rollback();
//     throw  error;
//   }
// };

export const addStock = async (value: typeof model.Stock, transaction: IDBTransaction) => {
  try {
    return await model.Stock.create(value, {transaction: transaction})
  } catch (error: any) {
    throw error
  }
};

export const updateStock = async (quantity: number, conditions: Object, transaction: IDBTransaction) => {
  try {
    return await model.Stock.update(
      {
        quantity: quantity
      },
      {
        where: conditions
      },
      {transaction: transaction}
    )
  } catch (error) {
    throw error;
  }
};

export const addStockMovment = async (value: typeof model.StockMovment, transaction: IDBTransaction) => {
  try {
    return await model.StockMovment.create(value, {transaction: transaction})
  } catch (error: any) {
    throw error;
  }
};

export const getProductsInStock = async (req: Request, shop: string) => {
  try {
    if (req.query.paginate && req.query.paginate == '1')
    {
      const page = (req.query.page && +req.query.page > 1) ? +req.query.page - 1 : 0;
      const size = req.query.size ? req.query.size : 10;
      const { limit, offset } = getPagination(page, +size)
      const stocks =  await model.Stock.findAndCountAll(
        { 
          include: 
          [
            {
              model: model.Shop,
              where: {
                shop_uuid: shop
              }
            },
            {
              model: model.Product
            }
          ],
          offset,
          limit,
          order: [
            ['updatedAt', 'DESC']
          ],
        }
      );
      return getPagingData(stocks, +page, 10);
    } else {
      const stocks =  await model.Stock.findAll(
        { 
          include: 
          [
            {
              model: model.Shop,
              where: {
                shop_uuid: shop
              }
            },
            {
              model: model.Product
            }
          ],
          order: [
            ['updatedAt', 'DESC']
          ],
        }
      );
      return stocks;
    }
  } catch (error: any) {
    throw error;
  }
}

export const getStock = async (shop: string, product :string) => {
  try {
    const stocks =  await model.Stock.findAll(
      { 
        include: [
          {
            model: model.Shop,
            where: {
              shop_uuid: shop
            }
          },
          {
            model: model.Product,
            where: {
              product_uuid: product
            }
          }
        ]
      }
    );
    const productInStock: typeof model.Product = [];
    stocks.forEach((stock: typeof model.Stock) => {
      productInStock.push(stock.product);
    })
    return stocks;
  } catch (error: any) {
    throw error;
  }
}

export const getStockById = async (shopId: number, productId: number) => {
  try {
    return await  model.Stock.findOne(
      { 
        include: [
          {
            model: model.Shop,
            where: {
              shop_id: shopId
            }
          },
          {
            model: model.Product,
            where: {
              product_id: productId
            }
          }
        ]
      }
    );
  } catch (error) {
    console.log('\nstock.servie::getStockById');
    console.log(error);
    throw error;
  }
}

export const createStock = async (stock: typeof model.Stock, _transaction: IDBTransaction | any = null) => {
  try {
    return await model.Stock.create(
      stock,
      {
        updateOnDuplicate: ["fk_shop_id", "fk_product_id"]
      },
      {
        transaction: _transaction
      }
    );
  } catch (error) {
    console.log('\nstock.servie::createStock');
    console.log(error);
    throw error;
  }
}

export const editStock = async (quantity: number, stockId: number, _transaction: IDBTransaction | any = null) => {
  try {
    return await model.Stock.update(
      { quantity: quantity },
      { where: { stock_id: stockId } }
    );
  } catch (error) {
    console.log('\nstock.servie::editStock');
    console.log(error);
    throw error;
  }
}

export const createStockMovment = async (stockMovments: typeof model.StockMovment[], _transaction: IDBTransaction | any = null) => {
  try {
    return await model.StockMovment.bulkCreate(stockMovments, { transaction: _transaction });
  } catch (error) {
    console.log('\nstock.servie::createStockMovment');
    console.log(error);
    throw error;
  }
}