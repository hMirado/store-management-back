const model = require("../models/index");
import { Request } from "express";
import { getPagination, getPagingData } from "../helpers/pagination";
import { Op } from "sequelize";

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

export const addStock = async (value: typeof model.Stock, transaction: IDBTransaction) => {
  try {
    return await model.Stock.create(value, {transaction: transaction})
  } catch (error: any) {
    throw new Error(error);
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
              where: productCondition
            }
          ],
          where: quantityCondition,
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
  } catch (error: any) {
    console.log('\nstock.servie::getStockById');
    console.log(error);
    throw new Error(error);
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
  } catch (error: any) {
    console.log('\nstock.servie::createStock');
    console.log(error);
    throw new Error(error);
  }
}

export const editStock = async (quantity: number, stockId: number, _transaction: IDBTransaction | any = null) => {
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

export const createStockMovment = async (stockMovments: typeof model.StockMovment[], _transaction: IDBTransaction | any = null) => {
  try {
    return await model.StockMovment.bulkCreate(stockMovments, { transaction: _transaction });
  } catch (error: any) {
    console.log('\nstock.servie::createStockMovment');
    console.log(error);
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