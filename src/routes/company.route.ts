const companyRouter = require('express').Router();
const companyController = require('../controllers/company.controller');
import { verifyToken } from "../middlewares/auth";

companyRouter.get('/', verifyToken, companyController.getCompanies);
companyRouter.get('/:uuid', verifyToken, companyController.getCompanyByUuid);

module.exports = companyRouter;