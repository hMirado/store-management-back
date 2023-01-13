import Sequelize from "sequelize";
const sequelize = require("../config/db.config");

export const StockTransfer = sequelize.define('stock_transfer', {
  stock_transfert_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  stock_transfert_uuid: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    unique: 'compositeIndex'
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
})