import Sequelize from "sequelize";
const sequelize = require("../config/db.config");

export const Transfer = sequelize.define(
	"transfer",
	{
		transfer_id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		transfer_uuid: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			allowNull: false,
			unique: "compositeIndex",
		},
		transfer_code: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: "compositeIndex",
		},
		transfer_commentary: {
			type: Sequelize.TEXT("long"),
			allowNull: true,
		},
	},
	{
		paranoid: true,
	}
);
