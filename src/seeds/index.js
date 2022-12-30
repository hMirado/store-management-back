const CategorySeed = require('./category');
const ProductSeed = require('./product');
const createStockMovmentTypeSeed = require('./serialization-type.seed');
const createSerializationTypeSeed = require('./stock-movment-type.seed');
const CompanySeed = require('./company');
const ShopSeed = require('./shop');
const authorizationSeed = require('./authorization.seed');
const roleSeed = require('./role.seed');
const authorizationRoleAdminSeed = require('./authorization-role-admin.seed');
const userSeed = require('./user.seed');

module.exports = () => {
  return Promise.all([
    CompanySeed(),
    CategorySeed(),
    createStockMovmentTypeSeed(),
    createSerializationTypeSeed(),
    authorizationSeed(),
    roleSeed()
  ]).then(() => {
    [
      ShopSeed(),
      //ProductSeed(),
      authorizationRoleAdminSeed(),
      userSeed()
    ];
  }).then(() => {
    console.log('\nSeed completed.\n')
  })
};