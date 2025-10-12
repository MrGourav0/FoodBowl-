import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ["cash", "online"],
        required: true
    },
    deliveryAddress: {
        text: String,
        latitude: Number,
        longitude: Number
    },
    totalAmount: {
        type: Number,
        required: true
    },
    shopOrders: [{
        shop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shop",
            required: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        subtotal: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "preparing", "ready", "out for delivery", "delivered", "cancelled"],
            default: "pending"
        },
        shopOrderItems: [{
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Item",
                required: true
            },
            name: String,
            price: Number,
            quantity: Number
        }],
        assignedDeliveryBoy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        deliveryBoyResponse: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending"
        },
        deliveryBoyResponseAt: Date,
        deliveryOtp: String,
        otpExpires: Date,
        deliveredAt: Date,
        assignment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DeliveryAssignment"
        }
    }],
    payment: {
        type: Boolean,
        default: false
    },
    razorpayOrderId: String,
    razorpayPaymentId: String
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;
