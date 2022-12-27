import Sequelize from "sequelize";

const sequelize = require("../config/db.config");

export const Authorization = sequelize.define("authorization", {
  authorization_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  authorization_uuid: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false
  },
  authorization_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  authorization_key: {
    type: Sequelize.STRING,
    allowNull: false
  },
  authorization_parent: {
    type: Sequelize.INTEGER,
    allowNull: true
  }
});