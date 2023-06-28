import Sequelize from "sequelize";
const sequelize = require("../config/db.config");

export const Sale = sequelize.define(
  "sale",
  {
    sale_id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		sale_uuid: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			allowNull: false,
		},
    discount: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    serialization: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  {
    paranoid: true
  }
)