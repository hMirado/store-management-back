const attributeTypeRouter = require('express').Router();
import { getTypeHandler } from "../controllers/attribute-type.controller"
import { verifyToken } from "../middlewares/auth";

attributeTypeRouter.get('/', verifyToken, getTypeHandler);


module.exports = attributeTypeRouter;