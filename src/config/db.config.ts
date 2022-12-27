const Sequelize = require('sequelize');
const sequelize = new Sequelize(
	'store', 
	'root',
	'tsangy090197', 
	{
		host: '127.0.0.1',
		dialect: 'mysql'
	}
);

module.exports = sequelize;