const transferRouter = require('express').Router();
import { createTransferHandler, getAllTransferHandler, getTransferByUuidByShopHandler, validateTransferHandler } from "../controllers/transfer.controller";
import { verifyToken } from "../middlewares/auth";

transferRouter.post('/', verifyToken, createTransferHandler);
transferRouter.post('/:transfer/validate/', verifyToken, validateTransferHandler);
transferRouter.get('/', verifyToken, getAllTransferHandler);
transferRouter.get('/:transfer/shop/:shop', verifyToken, getTransferByUuidByShopHandler);

module.exports = transferRouter;