const attributeRouter = require('express').Router();
import { createAttributeHandler } from '../controllers/attribute.controller'
import { verifyToken } from "../middlewares/auth";

attributeRouter.post('/', verifyToken, createAttributeHandler);

module.exports = attributeRouter;