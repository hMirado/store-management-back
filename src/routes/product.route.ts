const productRouter = require('express').Router();
const productController = require('../controllers/product.controller');
import { createProductHandler, getProductByCodeHandler, getSaleProductsHandler, getProductsHandler, countProductHandler } from '../controllers/product.controller';
import { verifyToken } from "../middlewares/auth";

productRouter.get('/', verifyToken, getProductsHandler);
productRouter.get('/count', verifyToken, countProductHandler);
productRouter.post('/', verifyToken, createProductHandler);
productRouter.get('/:code', verifyToken, getProductByCodeHandler);
productRouter.get('/sale/:shopUuid', verifyToken, getSaleProductsHandler);

module.exports = productRouter;