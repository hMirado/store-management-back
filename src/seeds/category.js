const Category = require("../models/category.model");

module.exports = function () {
	return Category.bulkCreate([
		{
      code: 'ACCESS',
			label: "Accessoire",
		},
		{
      code: 'APC',
			label: "Appareil photo & caméra",
		},
		{
      code: 'JV',
			label: "Jeux vidéo",
		},
		{
      code: 'OPC',
			label: "Ordinateur & PC",
		},
		{
      code: 'PHONE',
			label: "Smartphone",
		},
		{
      code: 'TBT',
			label: "Tablette",
		},
	]).then(_ => console.log('Seed category complete'));
};
