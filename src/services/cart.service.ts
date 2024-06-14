const model = require("../models/index");
import { where } from "sequelize";
import { getStockMovmentTypeByMovment } from "./stock-movment-type.service";
import { createStockMovment, getStockByProductShop } from "./stock.service";
const sequelize = require("../config/db.config");

export const generateNewCart = async (status: number, user: number, shop: number) => {
  try {
    return await model.Cart.findOne(
      {
        attributes: ['cart_id'],
        where: { fk_shop_id: shop },
        order: [['cart_id', 'DESC']]
      }
    ).then(async (value: any) => {
      const cartNumber = generateCartNumber()+('0000' + (value ? (value.cart_id + 1).toString() : '1')).slice(-4);
      return await createCart(status, user, shop, +cartNumber);
    }).then(async (value: any) => {
      return await getCartByNumber(value.cart_number);
    })
  } catch (error: any) {
    console.log(error);
    throw new Error(error.toString());
  }
}

export const createCart = async (status: number, user: number, shop: number, cart_number: number) => {
  try {
    return await model.Cart.create(
      {
        fk_customer: user,
        fk_shop_id: shop,
        cart_number,
        fk_cart_status: status
      }
    ) 
  } catch (error: any) {
    console.log(error);
    throw new Error(error.toString());
  }
}

export const getCartStatus = async (status: string) => {
  try {
    return await model.CartStatus.findOne(
      {
        where: {
          cart_status_code: status
        }
      }
    ); 
  } catch (error: any) {
    console.log(error);
    throw new Error(error.toString());
  }
}

const generateCartNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = ('0'+(now.getMonth() + 1)).slice(-2);
  const day = now.getDate();
  return year + month + day;
}

export const getCartByNumber = async (number: number) => {
  try {
    return await model.Cart.findOne(
      {
        attributes: { exclude: ['fk_seller', 'fk_customer', 'fk_shop_id', 'createdAt', 'deletedAt', 'fk_cart_status', 'updatedAt'] },
        include: [
          {
            model: model.User,
            as: 'customer',
            attributes: { exclude: ['token', 'password', 'email', 'createdAt', 'deletedAt', 'fk_role_id', 'phone_number', 'updatedAt'] },
          },
          {
            model: model.Shop,
            attributes: { exclude: ['is_opened', 'fk_company_id', 'status', 'createdAt', 'deletedAt', 'updatedAt'] }
          },
          {
            model: model.CartStatus,
            attributes: { exclude: ['createdAt', 'deletedAt', 'updatedAt', 'cart_status_id', 'cart_status_uuid'] }
          },
          {
            model: model.Product,
            attributes: { exclude: ['createdAt', 'deletedAt', 'updatedAt', 'image', 'image'] }
          }
        ],
        where: {
          cart_number: number
        }
      }
    ); 
  } catch (error: any) {
    console.log(error);
    throw new Error(error.toString());
  }
}

export const getCartByUuid = async (uuid: string) => {
  try {
    return await model.Cart.findOne(
      {
        include: [
          {
            model: model.User,
            as: 'customer',
            attributes: { exclude: ['token', 'password', 'email', 'createdAt', 'deletedAt', 'fk_role_id', 'phone_number', 'updatedAt'] },
          },
          {
            model: model.Shop,
            attributes: { exclude: ['is_opened', 'fk_company_id', 'status', 'createdAt', 'deletedAt', 'updatedAt'] }
          },
          {
            model: model.CartStatus,
            attributes: { exclude: ['createdAt', 'deletedAt', 'updatedAt', 'cart_status_id', 'cart_status_uuid'] }
          }
        ],
        where: {
          cart_uuid: uuid
        }
      }
    ); 
  } catch (error: any) {
    console.log(error);
    throw new Error(error.toString());
  }
}

export const getCartById = async (id: number) => {
  try {
    return await model.Cart.findOne(
      {
        attributes: { exclude: ['fk_seller', 'fk_customer', 'fk_shop_id', 'createdAt', 'deletedAt', 'fk_cart_status', 'updatedAt'] },
        include: [
          {
            model: model.User,
            as: 'customer',
            attributes: { exclude: ['token', 'password', 'email', 'createdAt', 'deletedAt', 'fk_role_id', 'phone_number', 'updatedAt'] },
          },
          {
            model: model.Shop,
            attributes: { exclude: ['is_opened', 'fk_company_id', 'status', 'createdAt', 'deletedAt', 'updatedAt'] }
          },
          {
            model: model.CartStatus,
            attributes: { exclude: ['createdAt', 'deletedAt', 'updatedAt', 'cart_status_id', 'cart_status_uuid'] }
          },
          {
            model: model.Product,
            attributes: { exclude: ['createdAt', 'deletedAt', 'updatedAt', 'image', 'image'] }
          }
        ],
        where: {
          cart_id: id
        }
      }
    ); 
  } catch (error: any) {
    console.log(error);
    throw new Error(error.toString());
  }
}

export const addProductToCart = async (shopId: number, cartId: number, productId: number, quantity: number) => {
  const transaction = await sequelize.transaction();
  try {
    const _stock: typeof model.Stock = await getStockByProductShop(productId, shopId);
    if(!_stock) throw new Error('Product doesn\'t in stock.');
    if(_stock && _stock.quantity < quantity) throw new Error('Stock inssuffisant');

    const stockMovmentType = await getStockMovmentTypeByMovment('OUT-SELL');
    const stockMovment = [{
      quantity: quantity,
      fk_stock_movment_type_id: stockMovmentType.stock_movment_type_id,
      fk_product_id: productId,
      fk_shop_id: shopId
    }];
    await createStockMovment(stockMovment, transaction);

    const cartProduct = await getProductInCart(cartId, productId);

    if (cartProduct && cartProduct.deletedAt) {
      await updateProductInCartQuantity(cartId, quantity, transaction);
    } else if (cartProduct && !cartProduct.deletedAt) {
      await updateProductInCartQuantity(cartId, quantity, transaction);
    } else { 
      await model.CartProduct.create(
        {
          cart_id: cartId,
          product_id: productId,
          quantity
        },
        transaction
      );
    }
    await transaction.commit();
    return await getCartById(cartId);
  } catch (error: any) {
    console.log(error);
    await transaction.rollback();
    throw new Error(error);
  }
}

export const getProductInCart = async (cartId: number, productId: number) => {
  try {
    return await model.CartProduct.findOne(
      {
        attributes: [
          'cart_product_id',
          'quantity',
          'deletedAt'
        ],
        where: {
          cart_id: cartId,
          product_id: productId
        },
        paranoid: false
      }
    )
  } catch (error: any) {
    throw new Error(error);
  }
}

export const updateProductInCartQuantity = async (id: number, quantity: number, transaction: typeof sequelize.IDBTransaction) => {
  try {
    return model.CartProduct.update(
      {
        quantity,
        deletedAt: null
      },
      {
        where: { cart_product_id: id }
      },
      transaction
    )
  } catch (error: any) {
    await transaction.rollback();
    throw new Error(error);
  }
}

export const deleteProductInCart = async (id: number, cartId: number, productId: number, quantity: number, shopId: number) => {
  const transaction = await sequelize.transaction();
  try {
    const stockMovmentType = await getStockMovmentTypeByMovment('CANCEL-SELL');
    const stockMovment = [{
      quantity: quantity,
      fk_stock_movment_type_id: stockMovmentType.stock_movment_type_id,
      fk_product_id: productId,
      fk_shop_id: shopId
    }];
    await createStockMovment(stockMovment, transaction);
    await model.CartProduct.destroy(
      {
        where: { cart_product_id: id },
        transaction
      }
    )
    await transaction.commit();
    return await getCartById(cartId);
  } catch (error: any) {
    await transaction.rollback();
    throw new Error(error);
  }
}