import Sequelize from "sequelize";
const sequelize = require("../config/db.config");

const Stock = sequelize.define("stock", {
    stock_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    stock_uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: 'compositeIndex'
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    // product_uuid: {
    //     type: Sequelize.UUID,
    //     allowNull: false,
    // }
});

module.exports = Stock;