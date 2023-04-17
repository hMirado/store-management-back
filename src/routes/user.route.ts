import { 
  createUserHandler, 
  findUserByUuidHandler, 
  addUserShopHandler, 
  updateUserShopHandler, 
  findAllUserHander, 
  countUserHandler, 
  updateUserHandler, 
  findUserUserWithShopHandler,
  resetPasswordHandller
} from '../controllers/user.controller';
const router  = require('express').Router();
import { verifyToken } from "../middlewares/auth";

router.post('/', verifyToken, createUserHandler);
router.get('/:uuid', verifyToken, findUserByUuidHandler);
router.post('/add-shop', verifyToken, addUserShopHandler);
router.post('/update-shop', verifyToken, updateUserShopHandler);
router.get('/', verifyToken, findAllUserHander);
router.get('/statistic/count', verifyToken, countUserHandler);
router.put('/update', verifyToken, updateUserHandler);
router.get('/:uuid/shop', verifyToken, findUserUserWithShopHandler);
router.put('/:uuid/reset-password', verifyToken, resetPasswordHandller); // password >>  lqKsyTzUh3QX

module.exports = router;