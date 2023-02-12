const Sequelize = require('sequelize');
const sequelize = new Sequelize(
	'planetg1_store', 
	'planetg1_store',
	'Tsangy090197!', 
	{
		host: '127.0.0.1',
		dialect: 'mysql',
    logging: true,
	}
);

module.exports = sequelize;