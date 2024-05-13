import { startSessionHandler, endSessionHandler } from "../controllers/session.controller";
import { verifyToken } from "../middlewares/auth";
import { Router } from "express";
const route = Router();
route.post("/", verifyToken, startSessionHandler);
route.put("/close/:session", verifyToken, endSessionHandler);
module.exports = route;