const productRouter = require('express').Router();
const productController = require('../controllers/product.controller');
import { createProductHandler, getProductByCodeHandler, getSaleProductsHandler } from '../controllers/product.controller';
import { verifyToken } from "../middlewares/auth";

productRouter.post('/import', verifyToken, productController.importProduct);
productRouter.get('/', verifyToken, productController.getProducts);
productRouter.get('/export-model', verifyToken, productController.exportProductModel);
productRouter.get('/count', verifyToken, productController.countProduct);
productRouter.post('/', verifyToken, createProductHandler);
productRouter.get('/:code', verifyToken, getProductByCodeHandler);
productRouter.get('/sale/:shopUuid', verifyToken, getSaleProductsHandler);

module.exports = productRouter;