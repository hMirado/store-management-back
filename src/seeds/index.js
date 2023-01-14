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
const statusTransferSeed = require('./status-transfert.seed');

module.exports = () => {
  return Promise.all([
    CompanySeed(),
    CategorySeed(),
    createStockMovmentTypeSeed(),
    createSerializationTypeSeed(),
    authorizationSeed(),
    roleSeed(),
    attributeTypeSeed(),
    statusTransferSeed()
  ]).then(() => {
    [
      ShopSeed(),
      ProductSeed(),
      authorizationRoleAdminSeed(),
      userSeed()
    ];
  }).then(() => {
    console.log('\nSeed completed.\n')
  })
};