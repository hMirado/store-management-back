import Sequelize from "sequelize";
const sequelize = require("../config/db.config");
const Transfer = require('./transfer.model');
const Serialization = require('./serialization.model');

export const TransferSerialization = sequelize.define(
  'transfer_serialization',
  {
    transfer_id: {
      type: Sequelize.INTEGER,
      references: {
        model: Transfer,
        key: 'transfer_id'
      }
    },
    serialization_id: {
      type: Sequelize.INTEGER,
      references: {
        model: Serialization,
        key: 'serialization_id'
      }
    },
  }
)