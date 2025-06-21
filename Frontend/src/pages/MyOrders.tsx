import React, { useState, useEffect } from "react";
import { apiService, Order } from "../config/api";
import { useAuth } from "../contexts/AuthContext";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  CreditCard,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const MyOrders: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    } else {
      setLoading(false);
      setError("Please log in to view your orders");
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching orders...");
      console.log("Authentication status:", isAuthenticated);

      // Check if auth header is set
      const token = localStorage.getItem("token");
      console.log("Token exists:", !!token);

      const response = await apiService.getUserOrders();
      console.log("Orders response:", response);
      setOrders(response.orders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load orders";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "processing":
        return <Package className="w-5 h-5 text-blue-500" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getPaymentStatus = (order: Order) => {
    // Since orders are paid on delivery, payment status depends on order status
    if (order.status === "delivered") {
      return {
        status: "paid",
        text: "Paid",
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
        icon: <DollarSign className="w-4 h-4 text-green-500" />,
      };
    } else if (order.status === "cancelled") {
      return {
        status: "cancelled",
        text: "Cancelled",
        color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
        icon: <XCircle className="w-4 h-4 text-red-500" />,
      };
    } else {
      return {
        status: "pending",
        text: "Pay on Delivery",
        color:
          "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
        icon: <CreditCard className="w-4 h-4 text-orange-500" />,
      };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "TND",
    }).format(price);
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const isOrderExpanded = (orderId: string) => expandedOrders.has(orderId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Error Loading Orders
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Orders
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track your order history and current orders
          </p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Orders Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You haven't placed any orders yet. Start shopping to see your
              orders here!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Order Header */}
                <div
                  className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600 cursor-pointer hover:from-orange-100 hover:to-red-100 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-200"
                  onClick={() => toggleOrderExpansion(order._id)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            order.status,
                          )}`}>
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {formatPrice(order.totalAmount)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(order.orderDate)}
                        </div>
                      </div>
                      {isOrderExpanded(order._id) ? (
                        <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {(() => {
                        const paymentStatus = getPaymentStatus(order);
                        return (
                          <>
                            {paymentStatus.icon}
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${paymentStatus.color}`}>
                              {paymentStatus.text}
                            </span>
                          </>
                        );
                      })()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Payment: {getPaymentStatus(order).text}
                    </div>
                  </div>
                </div>

                {/* Order Items - Conditionally Visible */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOrderExpanded(order._id)
                      ? "max-h-screen opacity-100"
                      : "max-h-0 opacity-0"
                  }`}>
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                            {item.product.photo ? (
                              <img
                                src={item.product.photo}
                                alt={item.product.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <Package className="w-8 h-8 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {item.product.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {formatPrice(item.price)}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {formatPrice(item.product.price)} each
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer */}
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Order Date: {formatDate(order.orderDate)}
                        </div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          Total: {formatPrice(order.totalAmount)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
