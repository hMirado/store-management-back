import { createUser } from "../services/user.service";

module.exports = async () => {
  const {first_name, last_name, email, phone_number, password, fk_shop_id, fk_role_id} = {
    "first_name": "Hobiniaina Mirado",
    "last_name": "RAMAHATSANGIARISON",
    "email": "miradotsangy@gmail.com",
    "phone_number": "0326912678",
    "password": "1234567890",
    "fk_shop_id": 1,
    "fk_role_id": 1
  };
  return await createUser(first_name, last_name, email, phone_number, password, fk_shop_id, fk_role_id);
};