const stockRouter = require('express').Router();
import { importStockHandler, getProductsInStockHandler, qetStockHandler } from '../controllers/stock.controller';
import { verifyToken } from "../middlewares/auth";

stockRouter.post('/import/:shop', verifyToken, importStockHandler);
stockRouter.get('/', verifyToken, getProductsInStockHandler);
stockRouter.get('/product', verifyToken, qetStockHandler);

module.exports = stockRouter;