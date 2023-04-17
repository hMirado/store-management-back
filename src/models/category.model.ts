import Sequelize from "sequelize";
const sequelize = require("../config/db.config");

const Category = sequelize.define(
	"category",
	{
		category_id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		category_uuid: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			allowNull: false,
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
	},
	{
		paranoid: true,
	}
);

module.exports = Category;
