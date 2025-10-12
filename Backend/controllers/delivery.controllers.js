import Order from "../models/order.model.js";
import DeliveryAssignment from "../models/deliveryAssignment.model.js";
import User from "../models/user.model.js";
import Shop from "../models/shop.model.js";

// Get available orders for delivery boys
export const getAvailableOrders = async (req, res) => {
    try {
        const deliveryBoyId = req.userId;
        
        // Find orders that are ready for delivery and not yet assigned
        const orders = await Order.find({
            "shopOrders.status": "ready",
            "shopOrders.assignedDeliveryBoy": null,
            "shopOrders.deliveryBoyResponse": "pending"
        })
        .populate("user", "fullName email mobile")
        .populate("shopOrders.shop", "name address")
        .populate("shopOrders.shopOrderItems.item", "name image price")
        .sort({ createdAt: -1 });

        // Format orders for delivery boy view
        const availableOrders = [];
        orders.forEach(order => {
            order.shopOrders.forEach(shopOrder => {
                if (shopOrder.status === "ready" && !shopOrder.assignedDeliveryBoy) {
                    availableOrders.push({
                        orderId: order._id,
                        shopOrderId: shopOrder._id,
                        customer: {
                            name: order.user.fullName,
                            email: order.user.email,
                            mobile: order.user.mobile
                        },
                        shop: {
                            name: shopOrder.shop.name,
                            address: shopOrder.shop.address
                        },
                        items: shopOrder.shopOrderItems,
                        subtotal: shopOrder.subtotal,
                        deliveryAddress: order.deliveryAddress,
                        createdAt: order.createdAt
                    });
                }
            });
        });

        return res.status(200).json(availableOrders);
    } catch (error) {
        return res.status(500).json({ message: `Get available orders error: ${error}` });
    }
};

// Accept an order
export const acceptOrder = async (req, res) => {
    try {
        const { orderId, shopOrderId } = req.body;
        const deliveryBoyId = req.userId;

        // Check if delivery boy is already assigned to another order
        const existingAssignment = await Order.findOne({
            "shopOrders.assignedDeliveryBoy": deliveryBoyId,
            "shopOrders.status": { $in: ["out for delivery", "ready"] }
        });

        if (existingAssignment) {
            return res.status(400).json({ 
                message: "You are already assigned to another order. Complete it first." 
            });
        }

        // Update the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(400).json({ message: "Order not found" });
        }

        const shopOrder = order.shopOrders.id(shopOrderId);
        if (!shopOrder) {
            return res.status(400).json({ message: "Shop order not found" });
        }

        if (shopOrder.assignedDeliveryBoy) {
            return res.status(400).json({ message: "Order already assigned to another delivery boy" });
        }

        // Assign delivery boy to order
        shopOrder.assignedDeliveryBoy = deliveryBoyId;
        shopOrder.deliveryBoyResponse = "accepted";
        shopOrder.deliveryBoyResponseAt = new Date();
        shopOrder.status = "out for delivery";

        await order.save();

        // Create delivery assignment record
        const assignment = await DeliveryAssignment.create({
            order: orderId,
            shop: shopOrder.shop,
            shopOrderId: shopOrderId,
            assignedTo: deliveryBoyId,
            status: "assigned",
            acceptedAt: new Date()
        });

        shopOrder.assignment = assignment._id;
        await order.save();

        return res.status(200).json({ 
            message: "Order accepted successfully",
            assignmentId: assignment._id
        });
    } catch (error) {
        return res.status(500).json({ message: `Accept order error: ${error}` });
    }
};

// Reject an order
export const rejectOrder = async (req, res) => {
    try {
        const { orderId, shopOrderId } = req.body;
        const deliveryBoyId = req.userId;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(400).json({ message: "Order not found" });
        }

        const shopOrder = order.shopOrders.id(shopOrderId);
        if (!shopOrder) {
            return res.status(400).json({ message: "Shop order not found" });
        }

        // Mark as rejected by this delivery boy
        shopOrder.deliveryBoyResponse = "rejected";
        shopOrder.deliveryBoyResponseAt = new Date();

        await order.save();

        return res.status(200).json({ message: "Order rejected" });
    } catch (error) {
        return res.status(500).json({ message: `Reject order error: ${error}` });
    }
};

// Get current assigned orders for delivery boy
export const getMyOrders = async (req, res) => {
    try {
        const deliveryBoyId = req.userId;

        const orders = await Order.find({
            "shopOrders.assignedDeliveryBoy": deliveryBoyId,
            "shopOrders.status": { $in: ["out for delivery", "delivered"] }
        })
        .populate("user", "fullName email mobile")
        .populate("shopOrders.shop", "name address")
        .populate("shopOrders.shopOrderItems.item", "name image price")
        .sort({ createdAt: -1 });

        const myOrders = [];
        orders.forEach(order => {
            order.shopOrders.forEach(shopOrder => {
                if (shopOrder.assignedDeliveryBoy && shopOrder.assignedDeliveryBoy.toString() === deliveryBoyId) {
                    myOrders.push({
                        orderId: order._id,
                        shopOrderId: shopOrder._id,
                        customer: {
                            name: order.user.fullName,
                            email: order.user.email,
                            mobile: order.user.mobile
                        },
                        shop: {
                            name: shopOrder.shop.name,
                            address: shopOrder.shop.address
                        },
                        items: shopOrder.shopOrderItems,
                        subtotal: shopOrder.subtotal,
                        status: shopOrder.status,
                        deliveryAddress: order.deliveryAddress,
                        acceptedAt: shopOrder.deliveryBoyResponseAt,
                        deliveredAt: shopOrder.deliveredAt
                    });
                }
            });
        });

        return res.status(200).json(myOrders);
    } catch (error) {
        return res.status(500).json({ message: `Get my orders error: ${error}` });
    }
};

// Mark order as delivered
export const markAsDelivered = async (req, res) => {
    try {
        const { orderId, shopOrderId } = req.body;
        const deliveryBoyId = req.userId;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(400).json({ message: "Order not found" });
        }

        const shopOrder = order.shopOrders.id(shopOrderId);
        if (!shopOrder) {
            return res.status(400).json({ message: "Shop order not found" });
        }

        if (shopOrder.assignedDeliveryBoy.toString() !== deliveryBoyId) {
            return res.status(400).json({ message: "You are not assigned to this order" });
        }

        if (shopOrder.status !== "out for delivery") {
            return res.status(400).json({ message: "Order is not out for delivery" });
        }

        // Mark as delivered
        shopOrder.status = "delivered";
        shopOrder.deliveredAt = new Date();

        // Update delivery assignment
        if (shopOrder.assignment) {
            await DeliveryAssignment.findByIdAndUpdate(shopOrder.assignment, {
                status: "completed"
            });
        }

        await order.save();

        return res.status(200).json({ message: "Order marked as delivered successfully" });
    } catch (error) {
        return res.status(500).json({ message: `Mark as delivered error: ${error}` });
    }
};

// Get delivery boy statistics
export const getDeliveryStats = async (req, res) => {
    try {
        const deliveryBoyId = req.userId;

        // Get today's deliveries
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayDeliveries = await Order.find({
            "shopOrders.assignedDeliveryBoy": deliveryBoyId,
            "shopOrders.status": "delivered",
            "shopOrders.deliveredAt": { $gte: today }
        });

        // Get total deliveries
        const totalDeliveries = await Order.countDocuments({
            "shopOrders.assignedDeliveryBoy": deliveryBoyId,
            "shopOrders.status": "delivered"
        });

        // Get pending deliveries
        const pendingDeliveries = await Order.countDocuments({
            "shopOrders.assignedDeliveryBoy": deliveryBoyId,
            "shopOrders.status": "out for delivery"
        });

        // Calculate total earnings (assuming ₹10 per delivery)
        const earningsPerDelivery = 10;
        const totalEarnings = totalDeliveries * earningsPerDelivery;
        const todayEarnings = todayDeliveries.length * earningsPerDelivery;

        return res.status(200).json({
            todayDeliveries: todayDeliveries.length,
            totalDeliveries,
            pendingDeliveries,
            totalEarnings,
            todayEarnings
        });
    } catch (error) {
        return res.status(500).json({ message: `Get delivery stats error: ${error}` });
    }
};
