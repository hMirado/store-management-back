const shopRouter = require('express').Router();
const shopController = require('../controllers/shop.controller');
import { verifyToken } from "../middlewares/auth";

shopRouter.get('/', shopController.getShops);
shopRouter.get('/:uuid', verifyToken, shopController.getShopByUuid);
shopRouter.post('/', verifyToken, shopController.createShop);
shopRouter.put('/:uuid', verifyToken, shopController.updateShop);
shopRouter.put('/:uuid/status', verifyToken, shopController.updateShopStatus);
shopRouter.delete('/:uuid', verifyToken, shopController.deleteShop);

module.exports = shopRouter;