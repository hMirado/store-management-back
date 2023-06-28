import Sequelize, { BOOLEAN }  from "sequelize";
const sequelize = require("../config/db.config");

export const Payment = sequelize.define(
  "payment",
  {
    payment_id: {
      type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
    },
    payment_uuid: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			allowNull: false,
			unique: "compositeIndex",
		},
    payment_key: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: "compositeIndex",
    },
    payment_label: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: "compositeIndex",
		},
    payment_active: {
      type: BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  },
	{
		paranoid: true,
	}
);