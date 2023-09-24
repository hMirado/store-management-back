const productRouter = require('express').Router();
import { 
  importProductHandler, 
  getProductByCodeHandler, 
  getSaleProductsHandler, 
  getProductsHandler, 
  countProductHandler,
  createProductWithPriceHandler,
  getProductByLabelOrCodeHandler,
  updateProductHandler,
  getProductByUuidHandler,
  getProductByLabelHandler,
  exportModelHandler
} from '../controllers/product.controller';
import { verifyToken } from "../middlewares/auth";
productRouter.get('/', verifyToken, getProductsHandler);
productRouter.get('/code/:code', verifyToken, getProductByCodeHandler);
productRouter.get('/label/:label', verifyToken, getProductByLabelHandler);
productRouter.get('/sale/:shopUuid', verifyToken, getSaleProductsHandler);
productRouter.get('/detail/:uuid', verifyToken, getProductByUuidHandler);
productRouter.get('/verify-label', verifyToken, getProductByLabelOrCodeHandler);
productRouter.get('/count', verifyToken, countProductHandler);
productRouter.post('/', verifyToken, createProductWithPriceHandler);
productRouter.put('/', verifyToken, updateProductHandler);
productRouter.post('/import', verifyToken, importProductHandler);
productRouter.get('/export', verifyToken, exportModelHandler);

module.exports = productRouter;