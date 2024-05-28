import { startSessionHandler, endSessionHandler, userSessionHandler } from "../controllers/session.controller";
import { verifyToken } from "../middlewares/auth";
import { Router } from "express";
const route = Router();
route.post("/", verifyToken, startSessionHandler);
route.put("/close/:session", verifyToken, endSessionHandler);
route.get("/user", verifyToken, userSessionHandler);
module.exports = route;