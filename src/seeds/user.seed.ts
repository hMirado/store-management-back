import { createUser } from "../services/user.service";
import { User } from "../models/user.model";

/* module.exports = () => {
  return User.bulkCreate([
    {
      "first_name": "Hobiniaina Mirado",
      "last_name": "RAMAHATSANGIARISON",
      "email": "miradotsangy@gmail.com",
      "phone_number": "0326912678",
      "password": "1234567890",
      "fk_role_id": 1
    },
    {
      "first_name": "RANDRIA",
      "last_name": "Jenny",
      "email": "jenny@yopmail.com",
      "phone_number": "0331204642",
      "password": "1234567890",
      "fk_role_id": 1
    },
    {
      "first_name": "John",
      "last_name": "DOE",
      "email": "john.doe@yopmail.com",
      "phone_number": "0330000001",
      "password": "1234567890",
      "fk_role_id": 2
    },
    {
      "first_name": "Jane",
      "last_name": "DOE",
      "email": "Jane.doe@yopmail.com",
      "phone_number": "0330000002",
      "password": "1234567890",
      "fk_role_id": 2
    }
  ])
} */

export const mirado = async () => {
  const {first_name, last_name, email, phone_number, password, fk_role_id} = {
    "first_name": "Hobiniaina Mirado",
    "last_name": "RAMAHATSANGIARISON",
    "email": "miradotsangy@gmail.com",
    "phone_number": "0326912678",
    "password": "1234567890",
    "fk_role_id": 1
  };
  return await createUser(first_name, last_name, email, phone_number, password, fk_role_id);
};

export const jenny = async () => {
  const {first_name, last_name, email, phone_number, password, fk_role_id} = {
    "first_name": "RANDRIA",
    "last_name": "Jenny",
    "email": "jenny@yopmail.com",
    "phone_number": "0331204642",
    "password": "1234567890",
    "fk_role_id": 1
  };
  return await createUser(first_name, last_name, email, phone_number, password, fk_role_id);
};

export const john = async () => {
  const {first_name, last_name, email, phone_number, password, fk_role_id} = {
    "first_name": "John",
    "last_name": "DOE",
    "email": "john.doe@yopmail.com",
    "phone_number": "0331508856",
    "password": "1234567890",
    "fk_role_id": 2
  };
  return await createUser(first_name, last_name, email, phone_number, password, fk_role_id);
};

export const jane = async () => {
  const {first_name, last_name, email, phone_number, password, fk_role_id} = {
    "first_name": "Jane",
    "last_name": "DOE",
    "email": "Jane.doe@yopmail.com",
    "phone_number": "0341394234",
    "password": "1234567890",
    "fk_role_id": 2
  };
  return await createUser(first_name, last_name, email, phone_number, password, fk_role_id);
};

export const symon = async () => {
  const {first_name, last_name, email, phone_number, password, fk_role_id} = {
    "first_name": "Symon",
    "last_name": "CASHLEY",
    "email": "Jane.doe@yopmail.com",
    "phone_number": "0331572422",
    "password": "1234567890",
    "fk_role_id": 2
  };
  return await createUser(first_name, last_name, email, phone_number, password, fk_role_id);
};