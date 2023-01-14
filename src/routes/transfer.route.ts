const transferRouter = require('express').Router();
import { createTransferHandler } from "../controllers/transfer.controller";
import { verifyToken } from "../middlewares/auth";

transferRouter.post('/', verifyToken, createTransferHandler);

module.exports = transferRouter;