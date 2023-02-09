import Sequelize from "sequelize";
const sequelize = require("../config/db.config");

export const TransferType = sequelize.define('transfer_type', {
  transfer_type_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  transfer_type_uuid: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    unique: 'compositeIndex'
  },
  transfer_type_code: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: 'compositeIndex'
  },
  transfer_type_label: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: 'compositeIndex'
  },
})