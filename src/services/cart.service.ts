const model = require("../models/index");
const sequelize = require("../config/db.config");

export const generateNewCart = async (status: number, user: number, shop: number) => {
  try {
    return await model.Cart.findOne(
      {
        attributes: ['cart_id'],
        order: [['cart_id', 'DESC']]
      }
    ).then(async (value: any) => {
      const cartNumber = generateCartNumber()+('0000' + (value ? (value.cart_id + 1).toString() : '1')).slice(-4);
      return await createCart(status, user, shop, +cartNumber);
    }).then(async (value: any) => {
      return await getCart(value.cart_number);
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

export const getCart = async (number: number) => {
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
          cart_number: number
        }
      }
    ); 
  } catch (error: any) {
    console.log(error);
    throw new Error(error.toString());
  }
}