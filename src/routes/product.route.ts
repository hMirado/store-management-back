const productRouter = require('express').Router();
import { 
  createProductHandler, 
  getProductByCodeHandler, 
  getSaleProductsHandler, 
  getProductsHandler, 
  countProductHandler,
  createProductWithPriceHandler,
  getProductByLabelOrCodeHandler,
  updateProductHandler,
  getProductByUuidHandler,
  getProductByLabelHandler
} from '../controllers/product.controller';
import { verifyToken } from "../middlewares/auth";

productRouter.get('/', verifyToken, getProductsHandler);
productRouter.get('/code/:code', verifyToken, getProductByCodeHandler);
productRouter.get('/label/:label', verifyToken, getProductByLabelHandler);
productRouter.get('/sale/:shopUuid', verifyToken, getSaleProductsHandler);
productRouter.get('/detail/:uuid', verifyToken, getProductByUuidHandler);
productRouter.get('/verify-label', verifyToken, getProductByLabelOrCodeHandler);
productRouter.get('/count', verifyToken, countProductHandler);
//productRouter.post('/', verifyToken, createProductHandler);
productRouter.post('/', verifyToken, createProductWithPriceHandler);
productRouter.put('/', verifyToken, updateProductHandler);

module.exports = productRouter;