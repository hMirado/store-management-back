import { Request, Response } from "express";
import { generateNewCart, getCartStatus, getCartByNumber, getCartByUuid, addProductToCart, deleteProductInCart, getProductInCart } from "../services/cart.service";
import { getProductByUuid } from "../services/product.service";

export const createCartHandler = async (req: Request, res: Response) => {
  try {
    const status = await getCartStatus('IN-PROGRESS');
    const user = res.locals.user;
    const cart = await generateNewCart(status.cart_status_id, user.user_id, req.body.shop);
    return res.status(201).json({status: 201, data: cart, notification: 'Votre session est démarré.'});
  } catch (error: any) {
    return res.status(500).json({ error: error, notification: "Erreur système!" });
  }
}

export const getCartByNumberHandler = async (req: Request, res: Response) => {
  try {
    const cartNumber = req.params.cart as string;
    if (!cartNumber) res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Panier non disponible'});
    const cart = await getCartByNumber(+cartNumber);
    return res.status(201).json({status: 200, data: cart, notification: 'Detail du panier'});
  } catch (error: any) {
    return res.status(500).json({ error: error, notification: "Erreur système!" });
  }
}

export const addProductToCartHandler = async (req: Request, res: Response) => {
  try {
    const cart = await getCartByUuid(req.body.cart);
    if (!cart) res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Panier non disponible'});

    const product = await getProductByUuid(req.body.product);
    if (!product) res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Produit indisponible'});

    const cartUpdated = await addProductToCart(cart.fk_shop_id, cart.cart_id, product.product_id, req.body.quantity);
    return res.status(201).json({status: 201, data: cartUpdated, notification: 'Produit ajouter dans le panier'});
  } catch (error: any) {
    return res.status(500).json({ error: error.toString(), notification: "Erreur système!" });
  }
}

export const deleteProductHandler = async (req: Request, res: Response) => {
  try {
    const cart = await getCartByUuid(req.body.cart);
    if (!cart) res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Panier non disponible'});

    const product = await getProductByUuid(req.body.product);
    if (!product) res.status(400).json({ status: 400, error: 'La syntaxe de la requête est erronée.', notification: 'Produit indisponible'});

    const cartProduct = await getProductInCart(cart.cart_id, product.product_id);

    const newCart = await deleteProductInCart(cartProduct.cart_product_id, cart.cart_id, product.product_id, cartProduct.quantity, cart.fk_shop_id);
    return res.status(201).json({status: 200, data: newCart, notification: 'Produit supprimer du panier'});
  } catch (error: any) {
    return res.status(500).json({ error: error.toString(), notification: "Erreur système!" });
  }
}