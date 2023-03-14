import { createUserHandler, findUserByUuidHandler, addUserShopHandler, updateUserShopHandler } from '../controllers/user.controller';
const router  = require('express').Router();
import { verifyToken } from "../middlewares/auth";

router.post('/', verifyToken, createUserHandler);
router.get('/:uuid', verifyToken, findUserByUuidHandler);
router.post('/add-shop', verifyToken, addUserShopHandler);
router.post('/update-shop', verifyToken, updateUserShopHandler);

module.exports = router;