import { createUserHandler, findUserByUuidHandler } from '../controllers/user.controller';
const router  = require('express').Router();
import { verifyToken } from "../middlewares/auth";

router.post('/', verifyToken, createUserHandler);
router.get('/:uuid', verifyToken, findUserByUuidHandler);

module.exports = router;