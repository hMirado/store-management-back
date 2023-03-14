const router  = require('express').Router();
import { getRolesHandler } from "../controllers/role.controller";
import { verifyToken } from "../middlewares/auth";

router.get('/', verifyToken, getRolesHandler);

module.exports = router;