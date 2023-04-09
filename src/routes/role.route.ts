const router  = require('express').Router();
import { getRolesHandler, getRoleByUuidHandler } from "../controllers/role.controller";
import { verifyToken } from "../middlewares/auth";

router.get('/', verifyToken, getRolesHandler);
router.get('/:uuid', verifyToken, getRoleByUuidHandler);

module.exports = router;