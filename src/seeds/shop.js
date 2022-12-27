const Shop = require("../models/shop.model");

module.exports = function () {
	return Shop.bulkCreate([
		{
			shop_name: "Global",
			shop_location: "Global",
			shop_box: "1",
			city: "Antananarivo",
			shop_login: "test-1",
			fk_company_id: 1,
		},
		{
			shop_name: "Shop 1",
			shop_location: "Suprême Center Behoririka",
			shop_box: "119",
			city: "Antananarivo",
			shop_login: "test-1",
			fk_company_id: 1,
		},
		{
			shop_name: "Shop 2",
			shop_location: "Suprême Center Behoririka",
			shop_box: "403",
			city: "Antananarivo",
			shop_login: "test-2",
			fk_company_id: 1,
		},
	]);
};
