const Category = require("../models/category.model");

module.exports = () => {
	return Category.bulkCreate([
		{
      code: 'ACC',
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
	]).then(() => console.log('Seed category complete'));
};
