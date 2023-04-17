import Sequelize from "sequelize";
const sequelize = require("../config/db.config");

export const Shop = sequelize.define(
	"shop",
	{
		shop_id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		shop_uuid: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			allowNull: false,
		},
		shop_code: {
			type: Sequelize.STRING,
			allowNull: true,
		},
		shop_name: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		shop_location: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		shop_box: {
			type: Sequelize.STRING,
			allowNull: true,
		},
		city: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		status: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
		createdAt: Sequelize.DATE,
		updatedAt: Sequelize.DATE,
	},
	{
		paranoid: true,
	}
);

// export class ShopModel extends Sequelize.Model {
// 	id!: number;
// 	name!: string;
// 	location!: string;
// 	box!: string;
// 	city!: string;
// 	createdAt?: string;
// 	updatedAt?: string;
// }
//
// export const Shop = sequelize.define<ShopModel, StoreAdd>('shop', {
//   id: {
//       type: Sequelize.INTEGER,
//       autoIncrement: true,
//       primaryKey: true
//   },
//   name: Sequelize.STRING,
//   location: Sequelize.STRING,
//   box: Sequelize.STRING,
//   city: Sequelize.STRING,
// })
