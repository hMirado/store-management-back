const transferRouter = require('express').Router();
import { createTransferHandler, getAllTransferHandler, getTransferByUuidByShopHandler, validateTransferHandler, getTransferByUuidHandler } from "../controllers/transfer.controller";
import { verifyToken } from "../middlewares/auth";

transferRouter.post('/', verifyToken, createTransferHandler);
transferRouter.get('/', verifyToken, getAllTransferHandler);
transferRouter.get('/:uuid', verifyToken, getTransferByUuidHandler);
transferRouter.put('/validate', verifyToken, validateTransferHandler);
transferRouter.get('/:transfer/shop/:shop', verifyToken, getTransferByUuidByShopHandler);

module.exports = transferRouter;