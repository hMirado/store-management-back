import Sequelize from "sequelize";
const sequelize = require("../config/db.config");

export const Sale = sequelize.define(
  "sale",
  {
    sale_id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		sale_uuid: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			allowNull: false,
		},
    sale_price: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    sale_quantity: {
      type: Sequelize.INTEGER,
			defaultValue: 1,
      allowNull: false
    },
    serialization: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  {
    paranoid: true
  }
)