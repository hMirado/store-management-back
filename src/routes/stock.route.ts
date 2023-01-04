const stockRouter = require('express').Router();
import { createOrUpdateStockHandler, getProductsInStockHandler, qetStockHandler } from '../controllers/stock.controller';
import { verifyToken } from "../middlewares/auth";

stockRouter.post('/:shop', verifyToken, createOrUpdateStockHandler);
stockRouter.get('/', verifyToken, getProductsInStockHandler);
stockRouter.get('/product', verifyToken, qetStockHandler);

module.exports = stockRouter;