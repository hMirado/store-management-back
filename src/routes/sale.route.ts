import { sellHandler, getSelledHandler, countSaleHandler } from "../controllers/sale.controller";
import { verifyToken } from "../middlewares/auth";
import { Router } from "express";
const route  = Router();

route.post('/', verifyToken, sellHandler);
route.get('/', verifyToken, getSelledHandler);
route.get('/count/:uuid?', verifyToken, countSaleHandler)

module.exports = route;