import Sequelize, { BOOLEAN } from "sequelize";
const sequelize = require("../config/db.config");

export const Product = sequelize.define(
	"product",
	{
		product_id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		product_uuid: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			allowNull: false,
			unique: "compositeIndex",
		},
		code: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: "compositeIndex",
		},
		label: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		is_serializable: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		image: {
			type: Sequelize.STRING,
			allowNull: true,
		}
	},
	{
		paranoid: true,
	}
);
