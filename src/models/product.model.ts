import Sequelize, { BOOLEAN } from "sequelize";
const sequelize = require("../config/db.config");

const Product = sequelize.define("product", {
  product_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  product_uuid: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    unique: true
  },
  code: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  label: {
    type: Sequelize.STRING,
    allowNull: false
  },
  ht_price: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  ttc_price: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  is_serializable: 
  {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  // fk_category_id: {
  //   type: Sequelize.INTEGER,
  //   allowNull: false,
  //   references: {
  //     model: "categories",
  //     key: "category_id"
  //   }
  // }
});

module.exports = Product;