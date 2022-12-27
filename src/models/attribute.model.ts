import Sequelize from "sequelize";
const sequelize = require("../config/db.config");

const Attribute = sequelize.define("attribute", {
  attribute_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  attribute_uuid: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false
  },
  camera: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: ''
  },
  graphics_card: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: ''
  },
  processor: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: ''
  },
  ram: {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  storage: {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  storage_type: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: ''
  }
  
  // fk_product_id: {
  //   type: Sequelize.INTEGER,
  //   allowNull: false,
  //   references: {
  //     model: "products",
  //     key: "product_id"
  //   }
  // }
});

module.exports = Attribute;