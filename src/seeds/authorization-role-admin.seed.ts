import {AuthorizationRole} from "../models/authorization-role.model";

module.exports = () => {
  return AuthorizationRole.bulkCreate([
    { role_id: 1, authorization_id: 1 },
    { role_id: 1, authorization_id: 2 },
    { role_id: 1, authorization_id: 3 },
    { role_id: 1, authorization_id: 4 },
    { role_id: 1, authorization_id: 5 },
    { role_id: 1, authorization_id: 6 },
    { role_id: 1, authorization_id: 7 },
    { role_id: 1, authorization_id: 8 },
    { role_id: 1, authorization_id: 9 },
    { role_id: 1, authorization_id: 10 },
    { role_id: 1, authorization_id: 11 },
    { role_id: 1, authorization_id: 12 },
    { role_id: 1, authorization_id: 13 },
    { role_id: 1, authorization_id: 14 },
    { role_id: 1, authorization_id: 15 },
    { role_id: 1, authorization_id: 16 },
    { role_id: 1, authorization_id: 17 },
    { role_id: 1, authorization_id: 18 },
    { role_id: 1, authorization_id: 19 },
    { role_id: 1, authorization_id: 20 },
    { role_id: 1, authorization_id: 21 },
    { role_id: 1, authorization_id: 22 },
    { role_id: 1, authorization_id: 23 },
    { role_id: 1, authorization_id: 24 }
  ]).then(() => console.log('Seed Authorization - Role completed.'))
};