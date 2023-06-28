import { getPrice } from "./price.service";
import { updateSerializationIsSold } from "./serialization.service";
import { getStockMovmentTypeByMovment } from "./stock-movment-type.service";
import { createStockMovment } from "./stock.service";
const model = require("../models/index");
const sequelize = require("../config/db.config");

export const sell = async (shop: number, user: number, product: number, serialization: string|null = null, price: number) => {
  const transaction = await sequelize.transaction();
  let created: any = {};
  try {
    console.log('shop', shop);
    console.log('user', user);
    console.log('product', product);
    console.log('serialization', serialization);

    // get product price

    const _price = await getPrice(product.toString(), shop.toString());
    const ttc_price = _price[0].ttc_price / 100;
    console.log('\nttc_price: ', ttc_price);
    const discount = ((ttc_price - price) * 100) / ttc_price
    console.log('\ndiscount: ', discount);
    
    // add data to sales table
    const saleValue: typeof model.sale = {
      fk_shop_id: shop,
      fk_user_id: user,
      fk_product_id: product,
      discount: discount * 100,
      serialization: serialization,
    };

    const sale: typeof model.sale = await addSaleData(saleValue, transaction);
    created.sale = sale;

    // get stock movment type
    const stockMovmentType = await getStockMovmentTypeByMovment('OUT-SELL');

    // add data to stock_movments and stock
    const stockMovement = {
      quantity: 1,
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

export const addSaleData = async (sale: typeof model.sale, transaction: IDBTransaction) => {
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