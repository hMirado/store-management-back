import Sequelize from "sequelize";
const sequelize = require("../config/db.config");
const Transfer = require('./transfer.model');
const Product = require('./product.model');

export const TransferProduct = sequelize.define(
  'transfer_product',
  {
    transfer_id: {
      type: Sequelize.INTEGER,
      references: {
        model: Transfer,
        key: 'transfer_id'
      }
    },
    product_id: {
      type: Sequelize.INTEGER,
      references: {
        model: Product,
        key: 'Product_id'
      }
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }
)