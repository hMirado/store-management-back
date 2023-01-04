const router = require('express').Router();
import { verifyToken } from "../middlewares/auth";
import { getSerializationTypeBysHandler } from "../controllers/serialization-type.controller";

router.get('/', verifyToken, getSerializationTypeBysHandler);

module.exports = router;