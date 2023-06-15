import Sequelize from "sequelize";
const sequelize = require("../config/db.config");

export const CashRegister = sequelize.define(
  "cash_register",
  {
    cash_register_id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
    },
    cash_register_uuid: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			allowNull: false,
    }
  },
	{
		paranoid: true,
	}
)