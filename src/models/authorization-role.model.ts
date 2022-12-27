import Sequelize from "sequelize";
const sequelize = require("../config/db.config");
const Role = require('./role.model');
const Authorization = require('./authorization.model');

export const AuthorizationRole = sequelize.define('AuthorizationRole', {
  role_id: {
    type: Sequelize.INTEGER,
    references: {
      model: Role,
      key: 'role_id'
    }
  },
  authorization_id: {
    type: Sequelize.INTEGER,
    references: {
      model: Authorization,
      key: 'authorization_id'
    }
  }
});