import Sequelize from "sequelize";
const sequelize = require("../config/db.config");

export const SerializationType = sequelize.define("serialization_type", {
    serialization_type_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    serialization_type_uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: 'compositeIndex'
    },
    code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: 'compositeIndex'
    },
    label: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: 'compositeIndex'
    },
});