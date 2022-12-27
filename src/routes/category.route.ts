const categoryRouter = require('express').Router();
const categoryController = require('../controllers/category.controller');
import { createCategories } from '../controllers/category.controller';
import { verifyToken } from "../middlewares/auth";

categoryRouter.get('/', verifyToken, categoryController.getCategories);
categoryRouter.get('/count', verifyToken, categoryController.countCategories);
categoryRouter.post('/import', verifyToken, categoryController.importCategory);
categoryRouter.get('/export-model', verifyToken, categoryController.exportCategoryModel);
categoryRouter.post('/', verifyToken, createCategories);

module.exports = categoryRouter;