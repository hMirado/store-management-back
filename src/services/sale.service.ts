import { Request } from "express";
import { QueryTypes } from "sequelize";
import { updateSerializationIsSold } from "./serialization.service";
import { getStockMovmentTypeByMovment } from "./stock-movment-type.service";
import { createStockMovment } from "./stock.service";
const model = require("../models/index");
const sequelize = require("../config/db.config");

export const sell = async (shop: number, user: number, product: number, serialization: string|null = null, price: number, quantity: number = 1) => {
  const transaction = await sequelize.transaction();
  let created: any = {};
  try {

    // add data to sales table
    const saleValue: typeof model.sale = {
      fk_shop_id: shop,
      fk_user_id: user,
      fk_product_id: product,
      sale_price: price * 100,
      sale_quantity: quantity,
      serialization: serialization,
    };

    const sale: typeof model.sale = await addSaleData(saleValue, transaction);
    created.sale = sale;

    // get stock movment type
    const stockMovmentType = await getStockMovmentTypeByMovment('OUT-SELL');

    // add data to stock_movments and stock
    const stockMovement = {
      quantity: quantity,
      fk_stock_movment_type_id: stockMovmentType.stock_movment_type_id,
      fk_product_id: product,
      fk_shop_id: shop
    }
  
    const stock = await createStockMovment([stockMovement], transaction)
    created.stock = stock;

    // update serialization is_sold status to true
    if (serialization != null) {
      const serializationUpdated = await updateSerializationIsSold(true, [serialization], transaction);
      created.serialization = serializationUpdated;
    }

    await transaction.commit();
    return created;
  } catch (error: any) {
    await transaction.rollback();
    console.log("\n sale.service::sale", error);
    throw new Error(error);
  }
}

export const addSaleData = async (sale: typeof model.sale, transaction: typeof sequelize.IDBTransaction) => {
  try {
    return await model.Sale.create(
      sale,
      { transaction: transaction }
    )
  } catch (error: any) {
    console.log("\n sale.service::addSaleData", error);
    throw new Error(error);
  }
}

export const getSelled = async (req: Request) => {
  const query = req.query;
  let select = "SELECT *, (select count(sale_id) FROM get_sales) AS total FROM get_sales WHERE deletedAt IS NULL";
  let replacements: Object = {}
  if (query.product && query.product != '') {
    select += ' AND (code LIKE :product OR label LIKE :product)';
    replacements = { ... replacements, ...{ product: `%${query.product}%`}}
  }
  if (query.category && query.category != '') {
    select += ' AND category_uuid = :category';
    replacements = { ... replacements, ...{ category: query.category}};
  }
  if (query.shop && query.shop != '') {
    select += ' AND shop_uuid = :shop';
    replacements = { ... replacements, ...{ shop: query.shop}};
  }
  if (query.startDate && query.startDate != '') {
    const date = new Date(query.startDate.toString() + ' ' + '00:00:00');
    select += ' AND createdAt >= :start'
    replacements = { ... replacements, ...{ start: date}};
  }
  if (query.endDate && query.endDate != '') {
    const date = new Date(`${query.endDate.toString()} 23:59:59`);
    select += ' AND createdAt <= :end'
    replacements = { ... replacements, ...{ end: date}};
  }

  const page = query.page ? +query.page : 1;
  const size = query.size ? +query.size : 10;
  const limit = page == 1 ? 0 : (page - 1) * size
  select += ' ORDER BY createdAt ASC LIMIT :limit, :size';
  replacements = { 
    ... replacements, 
    ...{ 
      limit: +limit,
      size: +size
    }
  };

  try {
    const products = await sequelize.query(
      select,
      {
        replacements: replacements,
        type: QueryTypes.SELECT
      }
    );

    const total = products.length > 0 ? products[0]['total'] : 0;
    const response = {
      totalItems: total,
      items: products,
      currentPage: page
    }
 
    return response;
  } catch (error: any) {
    console.log("\n sale.service::getSelled", error);
    throw new Error(error);
  }
}

export const countSale = async (shop: number|null = null) => {
  let conditions: any = {};
  if (shop && shop != null) conditions['fk_shop_id'] = shop;
  try {
    const total = await model.Sale.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('sale_price')), 'sales'],
        [sequelize.fn('COUNT', sequelize.col('sale_quantity')), 'quantities'],
      ]
    });
    return total[0];
  } catch (error: any) {
    console.log("\n sale.service::countSale", error);
    throw new Error(error);
  }
}