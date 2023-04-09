import Sequelize from "sequelize";
const sequelize = require("../config/db.config");

export const Role = sequelize.define(
	"role",
	{
		role_id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		role_uuid: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			allowNull: false,
		},
		role_key: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		role_name: {
			type: Sequelize.STRING,
			allowNull: false,
		},
	},
	{
		paranoid: true,
	}
);
