import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Shop from "../models/shop.model.js";

// Place order
export const placeOrder = async (req, res) => {
    try {
        const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;
        
        if (cartItems.length === 0 || !cartItems) {
            return res.status(400).json({ message: "Cart is empty" });
        }
        
        if (!deliveryAddress.text || deliveryAddress.latitude === undefined || deliveryAddress.longitude === undefined) {
            return res.status(400).json({ message: "Complete delivery address required" });
        }

        // Group items by shop
        const groupItemsByShop = {};
        cartItems.forEach(item => {
            const shopId = item.shop;
            if (!groupItemsByShop[shopId]) {
                groupItemsByShop[shopId] = [];
            }
            groupItemsByShop[shopId].push(item);
        });

        // Create shop orders
        const shopOrders = await Promise.all(Object.keys(groupItemsByShop).map(async (shopId) => {
            const shop = await Shop.findById(shopId).populate("owner");
            if (!shop) {
                throw new Error("Shop not found");
            }
            const items = groupItemsByShop[shopId];
            const subtotal = items.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0);
            
            return {
                shop: shop._id,
                owner: shop.owner._id,
                subtotal,
                shopOrderItems: items.map((i) => ({
                    item: i.id,
                    name: i.name,
                    price: i.price,
                    quantity: i.quantity
                }))
            };
        }));

        // Create order
        const newOrder = await Order.create({
            user: req.userId,
            paymentMethod,
            deliveryAddress,
            totalAmount,
            shopOrders
        });

        // Populate order data
        await newOrder.populate("shopOrders.shopOrderItems.item", "name image price");
        await newOrder.populate("shopOrders.shop", "name address");
        await newOrder.populate("shopOrders.owner", "fullName email mobile");
        await newOrder.populate("user", "fullName email mobile");

        return res.status(201).json(newOrder);
    } catch (error) {
        return res.status(500).json({ message: `Place order error: ${error}` });
    }
};

// Get user orders
export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.userId })
            .populate("shopOrders.shop", "name address")
            .populate("shopOrders.assignedDeliveryBoy", "fullName mobile")
            .populate("shopOrders.shopOrderItems.item", "name image price")
            .sort({ createdAt: -1 });

        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({ message: `Get user orders error: ${error}` });
    }
};

// Get owner orders
export const getOwnerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ "shopOrders.owner": req.userId })
            .populate("user", "fullName email mobile")
            .populate("shopOrders.shop", "name address")
            .populate("shopOrders.assignedDeliveryBoy", "fullName mobile")
            .populate("shopOrders.shopOrderItems.item", "name image price")
            .sort({ createdAt: -1 });

        // Filter orders to only show shop orders belonging to this owner
        const filteredOrders = orders.map(order => ({
            ...order.toObject(),
            shopOrders: order.shopOrders.filter(shopOrder => 
                shopOrder.owner.toString() === req.userId.toString()
            )
        })).filter(order => order.shopOrders.length > 0);

        return res.status(200).json(filteredOrders);
    } catch (error) {
        return res.status(500).json({ message: `Get owner orders error: ${error}` });
    }
};

// Update order status (for owners)
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, shopOrderId, status } = req.body;
        
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(400).json({ message: "Order not found" });
        }

        const shopOrder = order.shopOrders.id(shopOrderId);
        if (!shopOrder) {
            return res.status(400).json({ message: "Shop order not found" });
        }

        // Check if the owner is authorized to update this order
        if (shopOrder.owner.toString() !== req.userId.toString()) {
            return res.status(403).json({ message: "Not authorized to update this order" });
        }

        // Update status
        shopOrder.status = status;
        
        // If marking as ready, reset delivery boy assignment
        if (status === "ready") {
            shopOrder.assignedDeliveryBoy = null;
            shopOrder.deliveryBoyResponse = "pending";
            shopOrder.deliveryBoyResponseAt = null;
        }

        await order.save();

        // Populate updated data
        await order.populate("shopOrders.shop", "name address");
        await order.populate("shopOrders.assignedDeliveryBoy", "fullName mobile");
        await order.populate("user", "fullName email mobile");

        return res.status(200).json({
            message: "Order status updated successfully",
            order: order
        });
    } catch (error) {
        return res.status(500).json({ message: `Update order status error: ${error}` });
    }
};

// Get order by ID
export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const order = await Order.findById(orderId)
            .populate("user", "fullName email mobile")
            .populate("shopOrders.shop", "name address")
            .populate("shopOrders.assignedDeliveryBoy", "fullName mobile")
            .populate("shopOrders.shopOrderItems.item", "name image price");

        if (!order) {
            return res.status(400).json({ message: "Order not found" });
        }

        return res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({ message: `Get order by ID error: ${error}` });
    }
};
