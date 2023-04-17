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
    }
  ]).then(() => console.log('Seed Role complete'))
};

