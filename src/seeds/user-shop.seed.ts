import { UserShop } from "../models/user-shop.model";

module.exports = () => {
  return UserShop.bulkCreate([
    {user_id: 1, shop_id: 1},
    {user_id: 1, shop_id: 2},
    {user_id: 1, shop_id: 3},
    {user_id: 2, shop_id: 1},
    {user_id: 2, shop_id: 2},
    {user_id: 2, shop_id: 3},
    {user_id: 3, shop_id: 2},
    {user_id: 3, shop_id: 3},
  ])
}