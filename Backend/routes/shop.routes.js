import express from "express";
import { createEditShop, getMyShop, getShopByCity } from "../controllers/shop.controllers.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/", isAuth, createEditShop);
router.get("/my-shop", isAuth, getMyShop);
router.get("/city/:city", getShopByCity);

export default router;
