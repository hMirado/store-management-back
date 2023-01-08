const router = require('express').Router();
import { verifyToken } from "../middlewares/auth";
import { getSerializationByProductShopHanlder } from "../controllers/serialization.controller";

router.get('/:product', verifyToken, getSerializationByProductShopHanlder);

module.exports = router;