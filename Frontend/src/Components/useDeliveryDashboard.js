import { useState, useEffect, useCallback } from "react";
import apiService from "../api/apiService";

export const useDeliveryDashboard = () => {
  const [activeTab, setActiveTab] = useState("available");
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true); // Start with true for initial load
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch all data concurrently for faster loading
      const [availableOrdersRes, myOrdersRes, statsRes] = await Promise.all([
        apiService.get("/api/delivery/available-orders"),
        apiService.get("/api/delivery/my-orders"),
        apiService.get("/api/delivery/stats"),
      ]);

      setAvailableOrders(availableOrdersRes.data);
      setMyOrders(myOrdersRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to fetch dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAcceptOrder = async (orderId, shopOrderId) => {
    try {
      await apiService.post("/api/delivery/accept-order", { orderId, shopOrderId });

      // Optimistic UI update for a faster user experience
      const orderToMove = availableOrders.find(
        (o) => o.orderId === orderId && o.shopOrderId === shopOrderId
      );
      if (orderToMove) {
        setAvailableOrders((prev) =>
          prev.filter((o) => !(o.orderId === orderId && o.shopOrderId === shopOrderId))
        );
        setMyOrders((prev) => [{ ...orderToMove, status: 'out for delivery' }, ...prev]);
      }

      // Re-fetch stats as they will change
      apiService.get("/api/delivery/stats").then(res => setStats(res.data));
      
      // You can replace this with a toast notification
      alert("Order accepted successfully!");
    } catch (err) {
      console.error("Error accepting order:", err);
      alert(err.response?.data?.message || "Failed to accept order");
      // Optional: Re-fetch data to revert optimistic update on failure
      fetchData();
    }
  };

  const handleRejectOrder = async (orderId, shopOrderId) => {
    try {
      await apiService.post("/api/delivery/reject-order", { orderId, shopOrderId });
      
      // Optimistic UI update
      setAvailableOrders((prev) =>
        prev.filter((o) => !(o.orderId === orderId && o.shopOrderId === shopOrderId))
      );

      alert("Order rejected");
    } catch (err) {
      console.error("Error rejecting order:", err);
      alert("Failed to reject order");
    }
  };

  const handleMarkDelivered = async (orderId, shopOrderId) => {
    try {
      await apiService.post("/api/delivery/mark-delivered", { orderId, shopOrderId });

      // Optimistic update
      setMyOrders(prev => prev.map(o => 
        o.orderId === orderId && o.shopOrderId === shopOrderId 
          ? { ...o, status: 'delivered', deliveredAt: new Date().toISOString() } 
          : o
      ));

      // Re-fetch stats
      apiService.get("/api/delivery/stats").then(res => setStats(res.data));

      alert("Order marked as delivered!");
    } catch (err) {
      console.error("Error marking as delivered:", err);
      alert("Failed to mark as delivered");
    }
  };

  return {
    activeTab,
    setActiveTab,
    availableOrders,
    myOrders,
    stats,
    loading,
    error,
    actions: {
      handleAcceptOrder,
      handleRejectOrder,
      handleMarkDelivered,
    },
  };
};