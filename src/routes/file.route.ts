const fileRouter = require('express').Router();
import { 
  getImageHandler
} from '../controllers/file.controller';
import { verifyToken } from "../middlewares/auth";

fileRouter.get('/image/:type/:path', getImageHandler);

module.exports = fileRouter;