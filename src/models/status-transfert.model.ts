import Sequelize from "sequelize";
const sequelize = require("../config/db.config");

export const StatusTransfer = sequelize.define("status_transfert", {
  status_transfert_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  status_transfert_uuid: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      unique: 'compositeIndex'
  },
  status_code: {
    type: Sequelize.STRING,
    allowNull: false
  },
  status_label: {
    type: Sequelize.STRING,
    allowNull: false
  }
});