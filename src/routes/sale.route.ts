import { sellHandler } from "../controllers/sale.controller";
import { verifyToken } from "../middlewares/auth";
import { Router } from "express";
const route  = Router();

route.post('/', sellHandler);

module.exports = route;