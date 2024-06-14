import { verifyToken } from "../middlewares/auth";
import { Router } from "express";
import { createCartHandler, getCartByNumberHandler, addProductToCartHandler, deleteProductHandler } from "../controllers/cart.controller";

const route = Router();
route.post("/", verifyToken, createCartHandler);
route.get("/:cart", verifyToken, getCartByNumberHandler);
route.post("/add-product", verifyToken, addProductToCartHandler);
route.delete("/product", verifyToken, deleteProductHandler);

module.exports = route;