import { sellHandler, getSelledHandler } from "../controllers/sale.controller";
import { verifyToken } from "../middlewares/auth";
import { Router } from "express";
const route  = Router();

route.post('/', verifyToken, sellHandler);
route.get('/', verifyToken, getSelledHandler);

module.exports = route;