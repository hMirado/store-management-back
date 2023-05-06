const stockRouter = require('express').Router();
import { 
  getProductsInStockHandler,
  qetStockHandler,
  countStock ,
  addStockStockHandler,
  getStockByProductShopHandler
} from '../controllers/stock.controller';
import { verifyToken } from "../middlewares/auth";

stockRouter.get('/', verifyToken, getProductsInStockHandler);
stockRouter.get('/product', verifyToken, qetStockHandler);
stockRouter.get('/count', verifyToken, countStock);
stockRouter.post('/', verifyToken, addStockStockHandler);
stockRouter.get('/shop/:shop/product/:product', verifyToken, getStockByProductShopHandler);

module.exports = stockRouter;