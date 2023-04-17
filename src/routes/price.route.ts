const router = require('express').Router();
import { getPriceHandler, updatePriceHandler } from '../controllers/price.controller';
import { verifyToken } from "../middlewares/auth";

router.get('/product/:product', verifyToken, getPriceHandler);
router.put('/', verifyToken, updatePriceHandler);

module.exports = router;