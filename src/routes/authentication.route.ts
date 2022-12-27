import { loginHandler, logoutHandler } from "../controllers/authentication.controller";
const router  = require('express').Router();

router.post('/login', loginHandler);
router.get('/logout', logoutHandler);

module .exports = router;