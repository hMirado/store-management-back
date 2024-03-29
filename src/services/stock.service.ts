const model = require("../models/index");
import { Request } from "express";
import { getPagination, getPagingData } from "../helpers/pagination";
import { Op } from "sequelize";
import { getStockMovmentTypeByMovment } from "./stock-movment-type.service";
import { createMultipleSerialization, getSerializationByProduct_Type_Value } from "./serialization.service";
import { generateUniqueId, convertToExcel, generateExcel, encodeFile } from "../helpers/helper";
import { getProductByCode } from "./product.service";
import { getShopByUuidOrCode } from "./shop.service";
import { getSerializationTypeByCode } from "./seriliazation-type.service";
const sequelize = require("../config/db.config");
const fs = require('fs');

export const getStockByIdAndShop = async (product: number, shop: number) => {
  try {
    return await model.Stock.findOne({
      where: {
        fk_product_id: product,
        fk_shop_id: shop
      }
    })
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getProductsInStock = async (req: Request, shop: string|null = null) => {
  let productCondition: any = {}
  if (req.query.keyword) {
    productCondition[Op.or] = [
      {
        code: { [Op.like]: `%${req.query.keyword}%` }
      },
      {
        label: { [Op.like]: `%${req.query.keyword}%` }
      }
    ];
  }

  if (req.query.serialization == 'yes') productCondition['is_serializable'] = true;
  else if (req.query.serialization == 'no') productCondition['is_serializable'] = false;

  let quantityCondition: any = {}
  if (req.query.status) {
    if (req.query.status == 'in') {
      quantityCondition = { 
        quantity: { 
          [ Op.gt ]: 0
        }  
      }
    } else if (req.query.status == 'out') {
      quantityCondition = { 
        quantity: { 
          [ Op.eq ]: 0
        }  
      }
    }
  }

  let shopCondition: any = {}
  if (shop) shopCondition['shop_uuid']= shop

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
              where: shopCondition
            },
            {
              model: model.Product,
              where: productCondition,
              order: [
                ['label', 'asc']
              ],
            }
          ],
          where: quantityCondition,
          offset,
          limit,
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
    throw new Error(error);
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
    throw new Error(error);
  }
}

export const getStockById = async (shopId: number, productId: number) => {
  try {
    return await model.Stock.findOne(
      { 
        include: [
          { model: model.Shop },
          { model: model.Product }
        ],
        where: {
          fk_shop_id: shopId,
          fk_product_id: productId
        }
      }
    );
  } catch (error: any) {
    console.log('\nstock.servie::getStockById');
    console.log(error);
    throw new Error(error);
  }
}

export const createStock = async (stock: typeof model.Stock, _transaction: typeof sequelize.IDBTransaction | any = null) => {
  try {
    return await model.Stock.create(
      stock,
      {
        transaction: _transaction
      }
    );
  } catch (error: any) {
    console.log('\nstock.servie::createStock');
    console.log(error);
    throw new Error(error);
  }
}

export const editStock = async (quantity: number, stockId: number, _transaction: typeof sequelize.IDBTransaction | any = null) => {
  try {
    return await model.Stock.update(
      { quantity: quantity },
      { where: { stock_id: stockId } },
      { transaction: _transaction }
    );
  } catch (error: any) {
    console.log('\nstock.servie::editStock');
    console.log(error);
    throw new Error(error);
  }
}

export const createStockMovment = async (stockMovments: typeof model.StockMovment[], _transaction: typeof sequelize.IDBTransaction | any = null) => {
  try {
    return await model.StockMovment.bulkCreate(stockMovments, { transaction: _transaction });
  } catch (error: any) {
    console.log('\nstock.servie::createStockMovment', error);
    throw new Error(error);
  }
}

export const countProductInStock = async (shopId: number|null = null) => {
  let conditions: any = {
    quantity: { 
      [ Op.gt ]: 0
    },
  }
  if (shopId) conditions['fk_shop_id'] = shopId;
  try {
    return await model.Stock.count(
      {
        where: conditions
      }
    )
  } catch (error: any) {
    console.log('\nstock.servie::countProductInStock');
    console.log(error);
    throw new Error(error);
    ;
  }
}

export const countProductOutStock = async (shopId: number|null = null) => {
  let conditions: any = {
    quantity: { 
      [ Op.eq ]: 0
    },
  }
  if (shopId) conditions['fk_shop_id'] = shopId;
  try {
    return await model.Stock.count(
      {
        where: conditions
      }
    )
  } catch (error:any) {
    console.log('\nstock.service::countProductOutStock');
    console.log(error);
    throw new Error(error);
  }
}

export const addStock = async (product: typeof model.Product, shopId: number, isSerializable: boolean, _stock: any, req: Request,_transaction: typeof sequelize.IDBTransaction | any = null) => {
  const transaction = await sequelize.transaction();
  const quantity = req.body.quantity;
  const serializations = req.body.serializations;
  let stockImported: any = {};
  try {
    const stockMovmentType = await getStockMovmentTypeByMovment('IN-IMPORT');
    const stockMovment = [{
      quantity: quantity,
      fk_stock_movment_type_id: stockMovmentType.stock_movment_type_id,
      fk_product_id: product.product_id,
      fk_shop_id: shopId
    }];
    stockImported.movment = await createStockMovment(stockMovment, transaction);

    if (isSerializable) {
      const formatedSerialization = serializations.map((serialization: any) => {
        const id: string = generateUniqueId();
        return serialization.map((value: any) => {
          return {
            serialization_value: value.serialization,
            fk_serialization_type_id: value.type,
            fk_shop_id: shopId,
            fk_product_id: product.product_id,
            group_id: id
          }
        })
      });
      let flatSerialization = formatedSerialization.flatMap((subSerialization: any) => [...subSerialization]);
      stockImported.serialization = await createMultipleSerialization(flatSerialization, transaction);
    }

    await transaction.commit();
    return stockImported;
  } catch (error: any) {
    await transaction.rollback();
    console.error("\nstock.controller::addStock", error);
    throw new Error(error);
  }
}

export const getStockByProductShop = async (productId: number, shopId: number) => {
  try {
    return await model.Stock.findOne(
      {
        where: {
          fk_product_id: productId,
          fk_shop_id: shopId
        }
      }
    );
  } catch (error: any) {
    console.log('\nstock.servie::countProductInStock', error);
    throw new Error(error);
  }
}

export const updateStock = async (quantity: number, productId: number, shopId: number, _transaction: typeof sequelize.IDBTransaction | null = null) => {
  try {
    return await model.Stock.update(
      {
        quantity: quantity
      },
      {
        where: {
         fk_product_id: productId,
         fk_shop_id: shopId
        },
        returning: true,
        transaction: _transaction
      }
    )
  } catch (error: any) {
    console.log('\nstock.servie::updateStock', error);
    throw new Error(error);
  }
}

export const getProductStockQuantity = async (product_id: number, shop_id: number) => {
  try {
    return await model.Stock.findOne({
      where: {
        fk_product_id: product_id,
        fk_shop_id: shop_id
      }
    })
  } catch (error: any) {
    console.log('\nstock.servie::getProductQuantity', error);
    throw new Error(error);
  }
}

export const importStock = async (base64: string) => {
  const transaction = await sequelize.transaction();
  try {
    const excelData = convertToExcel(base64);
    let errors: any = {
      total: 0,
      data: []
    };
    let success: number = 0;
    const stockMovmentType = await getStockMovmentTypeByMovment('IN-IMPORT');
    for (let index = 0; index < excelData.length; index++) {
      const data = excelData[index];
      const value = excelData[index]; 
      delete Object.assign(value, {code_item: value['[ITEM_CODE] code article']})['[ITEM_CODE] code article'];
      delete Object.assign(value, {code_shop: value['[SHOP] Shop']})['[SHOP] Shop'];
      delete Object.assign(value, {quantity: value['[QUANTITY] Quantité']})['[QUANTITY] Quantité'];
      
      const {code_item, code_shop, quantity, ...serializations} = value;
      const erreur = {
        '[ITEM_CODE] code article': !value.code_item ? '' : value.code_item,
        '[SHOP] Shop': !value.code_shop ? '' : value.code_shop,
        '[QUANTITY] Quantité': !value.quantity ? '' : value.quantity,
        ... serializations
      }
      
      if (!value.code_item || !value.code_shop || !value.quantity) {
        errors['data'].push(erreur);
        errors.total ++;
      } else {
        const product = await getProductByCode(value.code_item);
        const shop = await getShopByUuidOrCode(value.code_shop);
        if (!product || !shop) {
          errors['data'].push(erreur);
          errors.total ++;
        } 
        else {
          const stockMovment = [{
            quantity: value.quantity,
            fk_stock_movment_type_id: stockMovmentType.stock_movment_type_id,
            fk_product_id: product.product_id,
            fk_shop_id: shop.shop_id
          }];
          if (product.is_serializable) {
            let newSerializations: any = [];
            const id: string = generateUniqueId();
            for (const key in serializations) {
              const code = key.toLocaleUpperCase().includes('IMEI') ? 'IMEI' : key.toLocaleUpperCase().includes('SN') ? 'SERIAL_NUMBER' : '';
              const type: typeof model.SerializationType = await getSerializationTypeByCode(code);
              if (code) {
                newSerializations.push({
                  serialization_value: serializations[key].toString(),
                  fk_serialization_type_id: type.serialization_type_id,
                  fk_product_id: product.product_id,
                  fk_shop_id: shop.shop_id,
                  group_id: id
                })
              } else {
                newSerializations.push({
                  serialization_value: null,
                  fk_serialization_type_id: null,
                  fk_product_id: product.product_id,
                  fk_shop_id: shop.shop_id,
                  group_id: id
                })
              }
            }
            let serializationValuesIsValid = false;
            newSerializations = newSerializations.filter((value: any) => value['fk_serialization_type_id'] != null);

            outerLoop:
            for (const value of newSerializations ) {
              const serialization = await getSerializationByProduct_Type_Value(product.product_id, value['fk_serialization_type_id'], value['serialization_value'] )
              if (serialization ) break outerLoop;
              if (
                !serialization && 
                value['serialization_value'] && 
                (value['serialization_value'] != null || value['serialization_value'] != '')
              ) {
                serializationValuesIsValid = true;
              }
            }

            if (!serializationValuesIsValid) {
              errors['data'].push(erreur);
              errors.total ++;
            } else {
              success++;
              await createStockMovment(stockMovment, transaction);
              await createMultipleSerialization(newSerializations, transaction);
            }
          } else {
            success++;
            await createStockMovment(stockMovment, transaction);
          }
        }
      }
    }

    await transaction.commit();
    const timestamp = new Date().getTime();
    const fileName = timestamp + ".xlsx";
    let fileEncoded = '';
    if (errors.total > 0) {
      generateExcel(errors.data, fileName);
      fileEncoded = encodeFile(fileName);
      if (fileEncoded != '') fs.unlinkSync(fileName);
    }
    return await {
      success: success,
      error: errors.total,
      file: fileEncoded
    }
  } catch (error: any) {
    await transaction.rollback()
    console.log('stock.servie::importStock', error);
    throw new Error(error);
  }
}