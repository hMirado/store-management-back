const shopRouter = require('express').Router();
const shopController = require('../controllers/shop.controller');
import { verifyToken } from "../middlewares/auth";
import { getShopByStatusHandler } from "../controllers/shop.controller";

shopRouter.get('/', verifyToken, shopController.getShops);
shopRouter.get('/:uuid', verifyToken, shopController.getShopByUuid);
shopRouter.post('/', verifyToken, shopController.createShop);
shopRouter.put('/:uuid', verifyToken, shopController.updateShop);
shopRouter.put('/:uuid/status', verifyToken, shopController.updateShopStatus);
shopRouter.delete('/:uuid', verifyToken, shopController.deleteShop);
shopRouter.get('/status', verifyToken, getShopByStatusHandler);

module.exports = shopRouter;