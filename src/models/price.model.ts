import Sequelize, { BOOLEAN } from "sequelize";
const sequelize = require("../config/db.config");

export const Price = sequelize.define(
	"price",
	{
		price_id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		price_uuid: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			allowNull: false,
			unique: "compositeIndex",
		},
		ht_price: {
			type: Sequelize.BIGINT,
			allowNull: false,
		},
		ttc_price: {
			type: Sequelize.BIGINT,
			allowNull: false,
		},
	},
	{
		paranoid: true,
	}
);
