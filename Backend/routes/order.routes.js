import express from "express";
import { 
    placeOrder, 
    getUserOrders, 
    getOwnerOrders, 
    updateOrderStatus, 
    getOrderById 
} from "../controllers/order.controllers.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

// Place order (requires authentication)
router.post("/", isAuth, placeOrder);

// Get user orders (requires authentication)
router.get("/user", isAuth, getUserOrders);

// Get owner orders (requires authentication)
router.get("/owner", isAuth, getOwnerOrders);

// Update order status (requires authentication)
router.put("/status", isAuth, updateOrderStatus);

// Get order by ID (requires authentication)
router.get("/:orderId", isAuth, getOrderById);

export default router;