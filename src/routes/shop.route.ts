const shopRouter = require('express').Router();
const shopController = require('../controllers/shop.controller');
import { verifyToken } from "../middlewares/auth";
import { getShopByStatusHandler, openShopHandler, getShopByUserHandler } from "../controllers/shop.controller";

shopRouter.get('/', verifyToken, shopController.getShops);
shopRouter.get('/:uuid', verifyToken, shopController.getShopByUuid);
shopRouter.post('/', verifyToken, shopController.createShop);
shopRouter.put('/:uuid', verifyToken, shopController.updateShop);
shopRouter.put('/:uuid/status', verifyToken, shopController.updateShopStatus);
shopRouter.delete('/:uuid', verifyToken, shopController.deleteShop);
shopRouter.get('/status', verifyToken, getShopByStatusHandler);
shopRouter.put('/open/:uuid', verifyToken, openShopHandler);
shopRouter.get('/user/:user', verifyToken, getShopByUserHandler);

module.exports = shopRouter;