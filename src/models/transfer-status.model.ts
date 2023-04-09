import Sequelize from "sequelize";
const sequelize = require("../config/db.config");

export const TransferStatus = sequelize.define(
	"transfer_status",
	{
		transfer_status_id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		transfer_status_uuid: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			allowNull: false,
			unique: "compositeIndex",
		},
		transfer_status_code: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		transfer_status_label: {
			type: Sequelize.STRING,
			allowNull: false,
		},
	},
	{
		paranoid: true,
	}
);
