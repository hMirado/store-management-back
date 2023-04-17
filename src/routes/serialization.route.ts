const router = require('express').Router();
import { verifyToken } from "../middlewares/auth";
import { getSerializationByProductShopHanlder, getSerializationByProduct_Type_ValueHandler } from "../controllers/serialization.controller";

router.get('/shop/product/:product', verifyToken, getSerializationByProductShopHanlder);
router.get('/product/:product/type/:type/serial/:serialization', verifyToken, getSerializationByProduct_Type_ValueHandler);

module.exports = router;