const categoryRouter = require('express').Router();
const categoryController = require('../controllers/category.controller');
import { createCategories, countCategories } from '../controllers/category.controller';
import { verifyToken } from "../middlewares/auth";

categoryRouter.post('/', verifyToken, createCategories);
categoryRouter.get('/', verifyToken, categoryController.getCategories);
categoryRouter.get('/count', verifyToken, countCategories);

module.exports = categoryRouter;