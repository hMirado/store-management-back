import Sequelize from "sequelize";
const sequelize = require("../config/db.config");

export const Attribute = sequelize.define(
	"attribute",
	{
		attribute_id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		attribute_uuid: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			allowNull: false,
		},
		attribute: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		attribute_serialization: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		is_sold: {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
	},
	{
		paranoid: true,
	}
);
