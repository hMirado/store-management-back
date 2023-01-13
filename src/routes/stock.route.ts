const stockRouter = require('express').Router();
import { createOrUpdateStockHandler, getProductsInStockHandler, qetStockHandler, countStock } from '../controllers/stock.controller';
import { verifyToken } from "../middlewares/auth";

stockRouter.post('/:shop', verifyToken, createOrUpdateStockHandler);
stockRouter.get('/', verifyToken, getProductsInStockHandler);
stockRouter.get('/product', verifyToken, qetStockHandler);
stockRouter.get('/count', verifyToken, countStock);

module.exports = stockRouter;