import Sequelize from "sequelize";
const sequelize = require("../config/db.config");
import { User } from "./user.model";
import { Shop } from "./shop.model";

export const UserShop = sequelize.define(
	"user_shop",
	{
		user_id: {
			type: Sequelize.INTEGER,
			references: {
				model: User,
				key: "user_id",
			},
		},
		shop_id: {
			type: Sequelize.INTEGER,
			references: {
				model: Shop,
				key: "shop_id",
			},
		},
	},
	// {
	// 	paranoid: true,
	// }
);
