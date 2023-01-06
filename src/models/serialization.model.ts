import Sequelize from "sequelize";
const sequelize = require("../config/db.config");

export const Serialization = sequelize.define("serialization", {
    serialization_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    serialization_uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true
    },
    serialization_value: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: false
    },
    attribute_serialization: {
      type: Sequelize.STRING,
      allowNull: false,
    }
});