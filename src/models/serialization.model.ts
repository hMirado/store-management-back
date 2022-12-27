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
    serial_number: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
    },
    imei: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
    }
});
