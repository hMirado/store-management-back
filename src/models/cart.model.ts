import Sequelize  from "sequelize";
const sequelize = require("../config/db.config");

export const Cart = sequelize.define(
  "cart",
  {
    cart_id: {
      type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
    },
    cart_uuid: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			allowNull: false,
			unique: "compositeIndex",
		}
  },
	{
		paranoid: true,
	}
);