import Sequelize from "sequelize";
const sequelize = require("../config/db.config");
const Cart = require("./cart.model");
const Product = require("./product.model");

export const CartProduct = sequelize.define(
  "cart_product",
  {
    cart_product_id: {
      type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
    },
    cart_product_uuid: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			allowNull: false,
			unique: "compositeIndex",
		},
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
    },
    quantity: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    }
  },
  {
    paranoid: true,
  }
);