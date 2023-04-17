const router = require('express').Router();
import { verifyToken } from "../middlewares/auth";
import { getSerializationTypesHandler } from "../controllers/serialization-type.controller";

router.get('/', verifyToken, getSerializationTypesHandler);

module.exports = router;