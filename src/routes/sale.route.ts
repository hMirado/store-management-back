import { sellHandler, getSelledHandler, countSaleHandler, getSaleGraphDataHandler } from "../controllers/sale.controller";
import { verifyToken } from "../middlewares/auth";
import { Router } from "express";
const route  = Router();

route.post('/', verifyToken, sellHandler);
route.get('/', verifyToken, getSelledHandler);
route.get('/count/:uuid?', verifyToken, countSaleHandler);
route.get('/graph/', verifyToken, getSaleGraphDataHandler);

module.exports = route;