import Sequelize from "sequelize";
const sequelize = require("../config/db.config");

export const StockMovmentType = sequelize.define("stock_movment_type", {
    stock_movment_type_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    stock_movment_type_uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true
    },
    movment: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
});

// module.exports = StockMovmentTypeModel;