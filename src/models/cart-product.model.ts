import Sequelize from "sequelize";
const sequelize = require("../config/db.config");
const Cart = require("./cart.model");
const Product = require("./product.model");

export const CartProduct = sequelize.define(
  "cart_product",
  {
    cart_id: {
      type: Sequelize.INTEGER,
			references: {
				model: Cart,
				key: "cart_id",
			},
    },
    product_id: {
      type: Sequelize.INTEGER,
			references: {
				model: Product,
				key: "product_id",
			},
    }
  }
);