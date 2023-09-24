const categoryRouter = require('express').Router();
const categoryController = require('../controllers/category.controller');
import { createCategories, countCategories, updateCategoryHandler, getCategoryByUuidHandler, importCategoryHandler, exportModelHandler } from '../controllers/category.controller';
import { verifyToken } from "../middlewares/auth";

categoryRouter.post('/', verifyToken, createCategories);
categoryRouter.get('/', verifyToken, categoryController.getCategories);
categoryRouter.get('/:uuid', verifyToken, getCategoryByUuidHandler);
categoryRouter.get('/statistic/count', verifyToken, countCategories);
categoryRouter.put('/:uuid', verifyToken, updateCategoryHandler);
categoryRouter.post('/import', verifyToken, importCategoryHandler);
categoryRouter.get('/export/model', exportModelHandler);

module.exports = categoryRouter;