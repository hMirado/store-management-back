const Category = require("../models/category.model");

module.exports = function () {
	return Category.bulkCreate([
		{
      code: 'ACCES',
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
      code: 'PC',
			label: "Ordinateur & PC",
		},
		{
      code: 'PHONE',
			label: "Smartphone",
		},
		{
      code: 'TAB',
			label: "Tablette",
		},
	]).then(_ => console.log('Seed category complete'));
};
