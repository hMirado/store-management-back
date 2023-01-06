import Sequelize from "sequelize";
const sequelize = require("../config/db.config");

export const AttributeType = sequelize.define("attributeType", 
  {
    attribute_type_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    attribut_type_uuid: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false
    },
    attribute_type_key: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    attribute_type_label: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    }
  }
);