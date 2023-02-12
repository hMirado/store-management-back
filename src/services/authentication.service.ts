import {User} from '../models/user.model';
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();

export const login = async (user: typeof User, password: string) => {
  try {
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        {user},
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "12h"
        }
      )

      const userTokenSaved = await User.update(
        {
          token: token
        },
        {
          where: { user_id: user.user_id}
        }
      )
      if (userTokenSaved) return token;
    }
  } catch (error: any) {
    throw error
  }
};

export const logout = async (token: string) => {
  try {
    const isLoggedOut = await User.update(
      {
        token: null
      },
      {
        where: { token: token}
      }
    )

    if (isLoggedOut) return true;
  } catch (error: any) {
    throw error
  }
}
