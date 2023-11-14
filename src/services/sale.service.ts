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
    process.stderr.write("\n sale.service::sale", error.toString());
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

export const getSaleGraphData = async (req: Request) => {
  const query = req.query;
  let replacements: Object = {};
  let saleDate: string = "DATE_FORMAT(s.createdAt, '%Y-%m-%d')";
  if (query.groupByDate) {
    const group = query.groupByDate as string;
    saleDate = group.toUpperCase() == "Y" ? "YEAR(s.createdAt)" : group.toUpperCase() === "M" ? "DATE_FORMAT(s.createdAt,'%Y-%m')" : "DATE_FORMAT(s.createdAt, '%Y/%m/%d')";
  }
  let groupBy = " GROUP BY 1, shop "
  let request = `SELECT 
              ${saleDate} as saleDate, CONCAT(sh.shop_location, ' ', COALESCE(sh.shop_box, '')) as shop,
              SUM(s.sale_price) / 100 as price 
              FROM sales s 
              INNER JOIN products p ON p.product_id = s.fk_product_id 
              INNER JOIN shops sh ON s.fk_shop_id = sh.shop_id 
              WHERE 1 = 1 
              `;
  if (query.startDate && query.endDate) {
    const startDate = query.startDate;
    const endDate = query.endDate;
    if ((new Date(startDate as string) > new Date(endDate as string))) {
      process.stderr.write("la date de début doit-être inferieur à la date de fin");
      throw "La date de début doit-être inferieur à la date de fin";
    } else {
      request += ` AND DATE(s.createdAt) BETWEEN DATE(:startDate) AND DATE(:endDate) `;
      replacements = { ... replacements, ...{startDate: startDate, endDate: endDate}};
    }
  }

  if (query.shop && query.shop != '') {
    request += ` AND sh.shop_uuid = :shop`;
    replacements = { ... replacements, ...{shop: query.shop}};
    groupBy += " ,s.fk_shop_id ";
  }
  if (query.product) {
    request += ` AND p.product_uuid = :product `;
    replacements = { ... replacements, ...{product: query.product}};
    groupBy += " ,p.product_id ";
  }

  request += groupBy;

  if (query.groupByDate) {
    const group = query.groupByDate as string;
    request += ` , ${group.toUpperCase() === "Y" ? "YEAR(saleDate)" : group.toUpperCase() === "M" ? "MONTH(saleDate)" : group.toUpperCase() === "W" ? "WEEK(saleDate)" : "saleDate"}`;
  }
  request += ' ORDER BY saleDate ASC, shop ASC'
  try {
    const values =  await sequelize.query(
      request,
      {
        replacements: replacements,
        type: QueryTypes.SELECT
      }
    );

    let sales: any[] = [];
    values.forEach((value: any) => {
      const maDate = new Date(value['saleDate'])
      const series = {
        name: maDate.toLocaleDateString("fr"),
        value: +value['price'].toLocaleString()
      };
      
      const isIn = sales.find(({name}) => name.toUpperCase() == value['shop'].toUpperCase());
      if (!isIn) {
        const data = {
          name: value['shop'],
          series: [ series ]
        }
        sales.push(data);
      } else {
        const objIndex = sales.findIndex((obj => obj["name"].toUpperCase() == value['shop'].toUpperCase()));
        sales[objIndex]['series'].push(series);
      }
    });
    return sales;
  } catch (error: any) {
    process.stderr.write("\n sale.service/getSaleGraphData : " + error.toString());
    throw error.toString();
  }
}