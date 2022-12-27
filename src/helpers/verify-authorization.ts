const model = require("../models/index")

export const verifyAuthorization = (authorizations: typeof model.Authorization[], key: string): Boolean => {
  const keys = authorizations.map((authorization: any) => authorization.authorization_key);
  return keys.includes(key)
};