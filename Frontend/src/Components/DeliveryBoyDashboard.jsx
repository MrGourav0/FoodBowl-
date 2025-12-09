import React from "react";
import { useSelector } from "react-redux";
import Nav from "./Nav";
import Footer from "./Footer";
import { useDeliveryDashboard } from "../hooks/useDeliveryDashboard";

const DeliveryBoyDashboard = () => {
  const { userData } = useSelector((state) => state.user);
  const {
    activeTab,
    setActiveTab,
    availableOrders,
    myOrders,
    stats,
    loading,
    error,
    actions,
  } = useDeliveryDashboard();

  return (
    <>
      <Nav />
      <div className="container mt-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card bg-success text-white">
              <div className="card-body">
                <h2 className="mb-0">
                  <i className="fa-solid fa-motorcycle me-2"></i>
                  Delivery Boy Dashboard
                </h2>
                <p className="mb-0">Welcome, {userData?.fullName || "Delivery Boy"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card bg-primary text-white">
              <div className="card-body text-center">
                <i className="fa-solid fa-clock fa-2x mb-2"></i>
                <h4>{stats.pendingDeliveries || 0}</h4>
                <p className="mb-0">Pending Orders</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-success text-white">
              <div className="card-body text-center">
                <i className="fa-solid fa-check-circle fa-2x mb-2"></i>
                <h4>{stats.todayDeliveries || 0}</h4>
                <p className="mb-0">Today's Deliveries</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-info text-white">
              <div className="card-body text-center">
                <i className="fa-solid fa-trophy fa-2x mb-2"></i>
                <h4>{stats.totalDeliveries || 0}</h4>
                <p className="mb-0">Total Deliveries</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-warning text-white">
              <div className="card-body text-center">
                <i className="fa-solid fa-rupee-sign fa-2x mb-2"></i>
                <h4>₹{stats.todayEarnings || 0}</h4>
                <p className="mb-0">Today's Earnings</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="row mb-4">
          <div className="col-12">
            <ul className="nav nav-tabs" id="deliveryTabs" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === "available" ? "active" : ""}`}
                  onClick={() => !loading && setActiveTab("available")}
                  type="button"
                >
                  <i className="fa-solid fa-list me-2"></i>
                  Available Orders ({availableOrders.length})
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === "my-orders" ? "active" : ""}`}
                  onClick={() => !loading && setActiveTab("my-orders")}
                  type="button"
                >
                  <i className="fa-solid fa-motorcycle me-2"></i>
                  My Orders ({myOrders.length})
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Tab Content */}
        <div className="row">
          <div className="col-12">
            {/* Available Orders Tab */}
            {activeTab === "available" && (
              <div className="tab-pane fade show active">
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">
                      <i className="fa-solid fa-list me-2"></i>
                      Available Orders
                    </h5>
                  </div>
                  <div className="card-body">
                    {loading && availableOrders.length === 0 ? (
                      <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading available orders...</p>
                      </div>
                    ) : error ? (
                      <div className="alert alert-danger" role="alert">
                        <i className="fa-solid fa-exclamation-triangle me-2"></i>
                        {error}
                      </div>
                    ) : availableOrders.length === 0 ? (
                      <div className="text-center py-5">
                        <i className="fa-solid fa-inbox fa-3x text-muted mb-3"></i>
                        <h5 className="text-muted">No Available Orders</h5>
                        <p className="text-muted">Check back later for new delivery opportunities!</p>
                      </div>
                    ) : (
                      <div className="row">
                        {availableOrders.map((order, index) => (
                          <div key={`${order.orderId}-${order.shopOrderId}`} className="col-md-6 mb-3">
                            <div className="card h-100">
                              <div className="card-header d-flex justify-content-between align-items-center">
                                <h6 className="mb-0">Order #{order.orderId.slice(-8)}</h6>
                                <span className="badge bg-warning">Ready for Delivery</span>
                              </div>
                              <div className="card-body">
                                <div className="row">
                                  <div className="col-6">
                                    <h6>Customer Details:</h6>
                                    <p className="mb-1"><strong>Name:</strong> {order.customer.name}</p>
                                    <p className="mb-1"><strong>Mobile:</strong> {order.customer.mobile}</p>
                                    <p className="mb-0"><strong>Email:</strong> {order.customer.email}</p>
                                  </div>
                                  <div className="col-6">
                                    <h6>Shop Details:</h6>
                                    <p className="mb-1"><strong>Shop:</strong> {order.shop.name}</p>
                                    <p className="mb-1"><strong>Address:</strong> {order.shop.address}</p>
                                    <p className="mb-0"><strong>Amount:</strong> ₹{order.subtotal}</p>
                                  </div>
                                </div>
                                <div className="mt-3">
                                  <h6>Delivery Address:</h6>
                                  <p className="mb-2">{order.deliveryAddress.text}</p>
                                  <h6>Items ({order.items.length}):</h6>
                                  <ul className="list-unstyled">
                                    {order.items.map((item, idx) => (
                                      <li key={idx} className="d-flex justify-content-between">
                                        <span>{item.name} x {item.quantity}</span>
                                        <span>₹{item.price * item.quantity}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                              <div className="card-footer">
                                <div className="d-flex gap-2">
                                  <button
                                    className="btn btn-success flex-fill"
                                    onClick={() => actions.handleAcceptOrder(order.orderId, order.shopOrderId)}
                                    disabled={loading}
                                  >
                                    <i className="fa-solid fa-check me-1"></i>
                                    Accept Order
                                  </button>
                                  <button
                                    className="btn btn-outline-danger flex-fill"
                                    onClick={() => actions.handleRejectOrder(order.orderId, order.shopOrderId)}
                                    disabled={loading}
                                  >
                                    <i className="fa-solid fa-times me-1"></i>
                                    Reject
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* My Orders Tab */}
            {activeTab === "my-orders" && (
              <div className="tab-pane fade show active">
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">
                      <i className="fa-solid fa-motorcycle me-2"></i>
                      My Assigned Orders
                    </h5>
                  </div>
                  <div className="card-body">
                    {loading && myOrders.length === 0 ? (
                       <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : myOrders.length === 0 ? (
                      <div className="text-center py-5">
                        <i className="fa-solid fa-motorcycle fa-3x text-muted mb-3"></i>
                        <h5 className="text-muted">No Assigned Orders</h5>
                        <p className="text-muted">Accept some orders from the Available Orders tab!</p>
                      </div>
                    ) : (
                      <div className="row">
                        {myOrders.map((order, index) => (
                          <div key={`${order.orderId}-${order.shopOrderId}`} className="col-md-6 mb-3">
                            <div className="card h-100">
                              <div className="card-header d-flex justify-content-between align-items-center">
                                <h6 className="mb-0">Order #{order.orderId.slice(-8)}</h6>
                                <span className={`badge ${
                                  order.status === 'out for delivery' ? 'bg-primary' : 
                                  order.status === 'delivered' ? 'bg-success' : 'bg-warning'
                                }`}>
                                  {order.status.replace('_', ' ').toUpperCase()}
                                </span>
                              </div>
                              <div className="card-body">
                                <div className="row">
                                  <div className="col-6">
                                    <h6>Customer Details:</h6>
                                    <p className="mb-1"><strong>Name:</strong> {order.customer.name}</p>
                                    <p className="mb-1"><strong>Mobile:</strong> {order.customer.mobile}</p>
                                    <p className="mb-0"><strong>Email:</strong> {order.customer.email}</p>
                                  </div>
                                  <div className="col-6">
                                    <h6>Shop Details:</h6>
                                    <p className="mb-1"><strong>Shop:</strong> {order.shop.name}</p>
                                    <p className="mb-1"><strong>Address:</strong> {order.shop.address}</p>
                                    <p className="mb-0"><strong>Amount:</strong> ₹{order.subtotal}</p>
                                  </div>
                                </div>
                                <div className="mt-3">
                                  <h6>Delivery Address:</h6>
                                  <p className="mb-2">{order.deliveryAddress.text}</p>
                                  <h6>Items ({order.items.length}):</h6>
                                  <ul className="list-unstyled">
                                    {order.items.map((item, idx) => (
                                      <li key={idx} className="d-flex justify-content-between">
                                        <span>{item.name} x {item.quantity}</span>
                                        <span>₹{item.price * item.quantity}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                {order.acceptedAt && (
                                  <div className="mt-2">
                                    <small className="text-muted">
                                      Accepted: {new Date(order.acceptedAt).toLocaleString()}
                                    </small>
                                  </div>
                                )}
                              </div>
                              <div className="card-footer">
                                {order.status === 'out for delivery' ? (
                                  <button
                                    className="btn btn-success w-100"
                                    onClick={() => actions.handleMarkDelivered(order.orderId, order.shopOrderId)}
                                    disabled={loading}
                                  >
                                    <i className="fa-solid fa-check-circle me-1"></i>
                                    Mark as Delivered
                                  </button>
                                ) : (
                                  <div className="text-center">
                                    <i className="fa-solid fa-check-circle text-success me-1"></i>
                                    <span className="text-success">Order Delivered</span>
                                    {order.deliveredAt && (
                                      <div className="mt-1">
                                        <small className="text-muted">
                                          Delivered: {new Date(order.deliveredAt).toLocaleString()}
                                        </small>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DeliveryBoyDashboard;
