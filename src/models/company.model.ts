import Sequelize from "sequelize";
const sequelize = require("../config/db.config");

const Company = sequelize.define("company", {
	company_id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false,
	},
	company_uuid: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		allowNull: false,
	},
	company_name: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	createdAt: Sequelize.DATE,
	updatedAt: Sequelize.DATE,
});

module.exports = Company;
