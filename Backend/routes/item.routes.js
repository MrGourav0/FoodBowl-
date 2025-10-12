import express from "express";
import { addItem, editItem, getItemById, deleteItem, getItemByCity, getItemsByShop, searchItems, rating } from "../controllers/item.controllers.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/", isAuth, addItem);
router.put("/:itemId", isAuth, editItem);
router.get("/:itemId", getItemById);
router.delete("/:itemId", isAuth, deleteItem);
router.get("/city/:city", getItemByCity);
router.get("/shop/:shopId", getItemsByShop);
router.get("/search", searchItems);
router.post("/rating", rating);

export default router;
