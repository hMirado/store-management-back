const router = require('express').Router();
import { getPriceHandler } from '../controllers/price.controller';
import { verifyToken } from "../middlewares/auth";

router.get('/product/:product', verifyToken, getPriceHandler);

module.exports = router;