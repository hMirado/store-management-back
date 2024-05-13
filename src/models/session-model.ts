import Sequelize from "sequelize";
const sequelize = require("../config/db.config");

export const Session = sequelize.define(
  "session",
  {
    session_id: {
      type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
    },
    session_uuid: {
      type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			allowNull: false,
			unique: "compositeIndex",
    },
    cash_float: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    session_amount: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    start_date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    end_date: {
      type: Sequelize.DATE,
    },
    is_started: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  },
	{
		paranoid: true,
	}
)