const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();
const sequelize = new Sequelize(
	process.env.DATABASE, 
	process.env.USERNAME,
	process.env.PASSWORD,
	{
		host: process.env.HOST,
		dialect: 'mysql',
    logging: true,
	}
);

module.exports = sequelize;