import { Shop } from "../models/shop.model";

module.exports = () => {
	return Shop.bulkCreate([
		{
			shop_code: "DEP",
			shop_name: "Dépôt",
			shop_location: "Dépôt",
			shop_box: "1",
			city: "Antananarivo",
			shop_login: "test-1",
			fk_company_id: 1,
		},
		{
			shop_code: "SHOP_1",
			shop_name: "120",
			shop_location: "Suprême Center Behoririka",
			shop_box: "119",
			city: "Antananarivo",
			shop_login: "shop1",
			fk_company_id: 1,
		},
		{
			shop_code: "SHOP_2",
			shop_name: "102",
			shop_location: "Suprême Center Behoririka",
			shop_box: "102",
			city: "Antananarivo",
			shop_login: "shop2",
			fk_company_id: 1,
		},
		{
			shop_code: "SHOP_2",
			shop_name: "403",
			shop_location: "Suprême Center Behoririka",
			shop_box: "403",
			city: "Antananarivo",
			shop_login: "shop3",
			fk_company_id: 1,
		},
		{
			shop_code: "SHOP_2",
			shop_name: "Analakely",
			shop_location: "Laibao Analakely",
			shop_box: "09",
			city: "Antananarivo",
			shop_login: "shop4",
			fk_company_id: 1,
		},
		{
			shop_code: "SHOP_2",
			shop_name: "Akoor",
			shop_location: "Akoor Digue",
			city: "Antananarivo",
			shop_login: "shop5",
			fk_company_id: 1,
		}
	]);
};
