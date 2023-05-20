const CategorySeed = require('./category');
const ProductSeed = require('./product');
const createSerializationTypeSeed= require('./serialization-type.seed');
const createStockMovmentTypeSeed = require('./stock-movment-type.seed');
const CompanySeed = require('./company');
const ShopSeed = require('./shop');
const authorizationSeed = require('./authorization.seed');
const roleSeed = require('./role.seed');
const authorizationRoleAdminSeed = require('./authorization-role-admin.seed');
const userSeed = require('./user.seed');
const attributeTypeSeed = require('./attribute-type.seed');
const transferStatusSeed = require('./transfer-status.seed');
const transferTypeSeed = require('./transfer-type.seed');
const userShopSeed = require('./user-shop.seed');

module.exports = () => {
  return Promise.all([
    CompanySeed(),
    CategorySeed(),
    createStockMovmentTypeSeed(),
    createSerializationTypeSeed(),
    authorizationSeed(),
    roleSeed(),
    attributeTypeSeed(),
    transferStatusSeed(),
    transferTypeSeed(),
    userSeed.mirado(),
    userSeed.jenny(),
    userSeed.jane(),
    userSeed.john(),
  ]).then(() => {
    [
      ShopSeed(),
      //ProductSeed(),
      authorizationRoleAdminSeed()
    ];
  }).then(() => {
    userShopSeed()
  }).then(() => {
    console.log('\nSeed completed.\n')
  })
};