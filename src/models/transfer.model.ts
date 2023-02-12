import Sequelize from "sequelize";
const sequelize = require("../config/db.config");

export const Transfer = sequelize.define('transfer', {
  transfer_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  transfer_uuid: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    unique: 'compositeIndex'
  },
  transfer_quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
})