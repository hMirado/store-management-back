import Sequelize from "sequelize";
const sequelize = require("../config/db.config");

export const CartStatus = sequelize.define(
  "cart_status",
  {
    cart_status_id: {
      type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
    },
    cart_status_uuid: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			allowNull: false,
			unique: "compositeIndex",
		},
    cart_status_code: {
      type: Sequelize.UUID,
			allowNull: false,
			unique: "compositeIndex",
    },
    cart_status_label: {
      type: Sequelize.UUID,
			allowNull: false,
			unique: "compositeIndex",
    }
  },
	{
		paranoid: true,
	}
)