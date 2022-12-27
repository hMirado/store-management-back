import { Role } from "../models/role.model";

module.exports = () => {
  return Role.bulkCreate([
    {
      role_key: 'ADMIN',
      role_name: 'ADMINISTARTEUR'
    },
    {
      role_key: 'SELLER',
      role_name: 'VENDEUR'
    },
    {
      role_key: 'CASHIER',
      role_name: 'CAISIER'
    },
    {
      role_key: 'SALE_CONTROLLER',
      role_name: 'CONTROLLEUR DE VENTE'
    }
  ]).then(() => console.log('Seed Role complete'))
};

