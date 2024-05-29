import { verifyToken } from "../middlewares/auth";
import { Router } from "express";
import { createCartHandler } from "../controllers/cart.controller";

const route = Router();
route.post("/", verifyToken, createCartHandler);

module.exports = route;