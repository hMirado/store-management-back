import { createUser } from "../services/user.service";

export const admin = async () => {
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

export const seller = async () => {
  const {first_name, last_name, email, phone_number, password, fk_shop_id, fk_role_id} = {
    "first_name": "John",
    "last_name": "DOE",
    "email": "john.doe@yopmail.com",
    "phone_number": "0326912670",
    "password": "1234567890",
    "fk_shop_id": 2,
    "fk_role_id": 2
  };
  return await createUser(first_name, last_name, email, phone_number, password, fk_shop_id, fk_role_id);
};