import Sequelize from "sequelize";
const sequelize = require("../config/db.config");

export const StockMovment = sequelize.define("stock_movment", {
    stock_movment_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    stock_movment_uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: 'compositeIndex'
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});