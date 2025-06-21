import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Select,
  MenuItem,
  CircularProgress,
  TablePagination,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Typography,
  Box,
  Divider,
  Chip,
} from "@mui/material";
import {
  Trash2,
  Eye,
  Package,
  User,
  MapPin,
  DollarSign,
  Printer,
} from "lucide-react";
import { apiService } from "../../config/api";
import type { Order } from "../../config/api";

const ORDER_STATUSES = ["pending", "delivered", "cancelled"];

interface OrdersTableProps {
  refreshFlag?: number;
}

const getErrorMessage = (err: unknown) => {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  if (
    typeof err === "object" &&
    err &&
    "message" in err &&
    typeof (err as { message?: unknown }).message === "string"
  )
    return (err as { message: string }).message;
  return "An error occurred";
};

const OrdersTable: React.FC<OrdersTableProps> = ({ refreshFlag }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<null | string>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [viewDetailsDialog, setViewDetailsDialog] = useState<null | Order>(
    null,
  );
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.getAllOrders({
        page: page + 1,
        limit: rowsPerPage,
      });
      setOrders(res.orders);
      setTotalOrders(res.pagination.total);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [page, rowsPerPage, refreshFlag]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setStatusUpdating(orderId);
    try {
      await apiService.updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch (err: unknown) {
      alert(getErrorMessage(err));
    } finally {
      setStatusUpdating(null);
    }
  };

  const handleDeleteOrder = async () => {
    if (!deleteDialog) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await apiService.deleteOrder(deleteDialog);
      setDeleteDialog(null);
      fetchOrders();
    } catch (err: unknown) {
      setDeleteError(getErrorMessage(err));
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setViewDetailsDialog(order);
  };

  const handleShowTrack = (order: Order) => {
    const address = order.deliveryAddress;
    const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
    const encodedAddress = encodeURIComponent(fullAddress);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(googleMapsUrl, "_blank");
  };

  const handlePrintInvoice = (order: Order) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - Order ${order._id.slice(-6).toUpperCase()}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background: white;
          }
          .invoice-container {
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            border: 2px solid #1976d2;
            border-radius: 8px;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #1976d2;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #1976d2;
            margin-bottom: 5px;
          }
          .company-tagline {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
          }
          .invoice-title {
            font-size: 24px;
            font-weight: bold;
            color: #333;
          }
          .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }
          .invoice-info, .customer-info {
            flex: 1;
          }
          .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #1976d2;
            margin-bottom: 10px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
          }
          .info-row {
            margin-bottom: 5px;
            font-size: 14px;
          }
          .info-label {
            font-weight: bold;
            color: #555;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          .items-table th {
            background: #1976d2;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: bold;
          }
          .items-table td {
            padding: 12px;
            border-bottom: 1px solid #ddd;
          }
          .items-table tr:nth-child(even) {
            background: #f9f9f9;
          }
          .total-section {
            margin-top: 30px;
            text-align: right;
          }
          .total-row {
            font-size: 16px;
            margin-bottom: 5px;
          }
          .total-amount {
            font-size: 20px;
            font-weight: bold;
            color: #1976d2;
            border-top: 2px solid #1976d2;
            padding-top: 10px;
            margin-top: 10px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 20px;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .status-pending { background: #fff3cd; color: #856404; }
          .status-delivered { background: #d4edda; color: #155724; }
          .status-cancelled { background: #f8d7da; color: #721c24; }
          @media print {
            body { margin: 0; }
            .invoice-container { border: none; margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div class="company-name">DSG Wholesale</div>
            <div class="company-tagline">Your Premier Wholesale Partner</div>
            <div class="invoice-title">INVOICE</div>
          </div>
          
          <div class="invoice-details">
            <div class="invoice-info">
              <div class="section-title">Invoice Details</div>
              <div class="info-row">
                <span class="info-label">Invoice #:</span> ${order._id
                  .slice(-6)
                  .toUpperCase()}
              </div>
              <div class="info-row">
                <span class="info-label">Date:</span> ${new Date(
                  order.orderDate,
                ).toLocaleDateString()}
              </div>
              <div class="info-row">
                <span class="info-label">Status:</span> 
                <span class="status-badge status-${order.status}">${
      order.status
    }</span>
              </div>
            </div>
            
            <div class="customer-info">
              <div class="section-title">Customer Information</div>
              <div class="info-row">
                <span class="info-label">Name:</span> ${
                  order.user?.name || "N/A"
                }
              </div>
              <div class="info-row">
                <span class="info-label">Store:</span> ${
                  order.user?.storeName || "N/A"
                }
              </div>
              <div class="info-row">
                <span class="info-label">Phone:</span> ${
                  order.user?.phone || "N/A"
                }
              </div>
              <div class="info-row">
                <span class="info-label">Address:</span><br>
                ${order.deliveryAddress.street}<br>
                ${order.deliveryAddress.city}, ${order.deliveryAddress.state} ${
      order.deliveryAddress.zipCode
    }<br>
                ${order.deliveryAddress.country}
              </div>
            </div>
          </div>
          
          <table class="items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.product.name}</td>
                  <td>${item.product.category}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.price.toFixed(2)}</td>
                  <td>$${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
          
          <div class="total-section">
            <div class="total-row">
              <span class="info-label">Subtotal:</span> $${order.totalAmount.toFixed(
                2,
              )}
            </div>
            <div class="total-row">
              <span class="info-label">Tax:</span> $0.00
            </div>
            <div class="total-row">
              <span class="info-label">Shipping:</span> $0.00
            </div>
            <div class="total-amount">
              <span class="info-label">Total Amount:</span> $${order.totalAmount.toFixed(
                2,
              )}
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for your business!</p>
            <p>DSG Wholesale - Quality Products, Competitive Prices</p>
            <p>For any questions, please contact our customer service</p>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "delivered":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", mb: 4 }}>
      {/* Desktop Table View */}
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress size={32} />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Alert severity="error">{error}</Alert>
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order._id} hover>
                    <TableCell>{order._id.slice(-6).toUpperCase()}</TableCell>
                    <TableCell>
                      {order.user?.name}
                      <br />
                      <span style={{ fontSize: 12, color: "#888" }}>
                        {order.user?.storeName}
                      </span>
                    </TableCell>
                    <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        disabled={statusUpdating === order._id}>
                        {ORDER_STATUSES.map((status) => (
                          <MenuItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      {(() => {
                        // Some APIs may return orderDate, some createdAt
                        const dateStr =
                          order.orderDate ??
                          (order as { createdAt?: string }).createdAt ??
                          "";
                        return dateStr
                          ? new Date(dateStr).toLocaleString()
                          : "-";
                      })()}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleViewDetails(order)}>
                          <Eye size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Show Track">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleShowTrack(order)}>
                          <MapPin size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Print Invoice">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handlePrintInvoice(order)}>
                          <Printer size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Order">
                        <span>
                          <IconButton
                            size="small"
                            color="error"
                            disabled={statusUpdating === order._id}
                            onClick={() => setDeleteDialog(order._id)}>
                            <Trash2 size={18} />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Mobile Card View */}
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress size={32} />
          </Box>
        ) : error ? (
          <Box sx={{ p: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : orders.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography>No orders found.</Typography>
          </Box>
        ) : (
          <Box sx={{ p: 2 }}>
            {orders.map((order) => (
              <Paper
                key={order._id}
                sx={{
                  p: 2,
                  mb: 2,
                  border: "1px solid #e0e0e0",
                }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, fontSize: "1rem" }}>
                      #{order._id.slice(-6).toUpperCase()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.user?.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: "0.8rem" }}>
                      {order.user?.storeName}
                    </Typography>
                  </Box>
                  <Chip
                    label={
                      order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)
                    }
                    color={
                      getStatusColor(order.status) as
                        | "warning"
                        | "success"
                        | "error"
                        | "default"
                    }
                    size="small"
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(order.orderDate || "").toLocaleDateString()}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "primary.main" }}>
                    ${order.totalAmount.toFixed(2)}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: "space-between",
                  }}>
                  <Select
                    size="small"
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    disabled={statusUpdating === order._id}
                    sx={{ flex: 1, mr: 1 }}>
                    {ORDER_STATUSES.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>

                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleViewDetails(order)}>
                        <Eye size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Show Track">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleShowTrack(order)}>
                        <MapPin size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Print Invoice">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handlePrintInvoice(order)}>
                        <Printer size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Order">
                      <IconButton
                        size="small"
                        color="error"
                        disabled={statusUpdating === order._id}
                        onClick={() => setDeleteDialog(order._id)}>
                        <Trash2 size={16} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Box>

      <TablePagination
        component="div"
        count={totalOrders}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDialog} onClose={() => setDeleteDialog(null)}>
        <DialogTitle>Delete Order</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this order? This action cannot be
          undone.
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog(null)}
            disabled={deleteLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteOrder}
            color="error"
            disabled={deleteLoading}
            variant="contained">
            {deleteLoading ? <CircularProgress size={20} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog
        open={!!viewDetailsDialog}
        onClose={() => setViewDetailsDialog(null)}
        maxWidth="md"
        fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Package size={20} />
            <Typography variant="h6">Order Details</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ mt: 2 }}>
              {/* Order Header */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Order #{selectedOrder._id.slice(-6).toUpperCase()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(selectedOrder.orderDate || "").toLocaleString()}
                  </Typography>
                </Box>
                <Chip
                  label={
                    selectedOrder.status.charAt(0).toUpperCase() +
                    selectedOrder.status.slice(1)
                  }
                  color={
                    getStatusColor(selectedOrder.status) as
                      | "warning"
                      | "success"
                      | "error"
                      | "default"
                  }
                  variant="outlined"
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Customer Information */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                  <User size={18} />
                  Customer Information
                </Typography>
                <Box sx={{ pl: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {selectedOrder.user?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Store: {selectedOrder.user?.storeName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Phone: {selectedOrder.user?.phone}
                  </Typography>
                </Box>
              </Box>

              {/* Delivery Address */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                  <MapPin size={18} />
                  Delivery Address
                </Typography>
                <Box sx={{ pl: 2 }}>
                  <Typography variant="body2">
                    {selectedOrder.deliveryAddress.street}
                  </Typography>
                  <Typography variant="body2">
                    {selectedOrder.deliveryAddress.city},{" "}
                    {selectedOrder.deliveryAddress.state}{" "}
                    {selectedOrder.deliveryAddress.zipCode}
                  </Typography>
                  <Typography variant="body2">
                    {selectedOrder.deliveryAddress.country}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Order Items */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Order Items
                </Typography>
                <Box sx={{ maxHeight: 300, overflow: "auto" }}>
                  {selectedOrder.items.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        py: 1,
                        borderBottom:
                          index < selectedOrder.items.length - 1
                            ? "1px solid #eee"
                            : "none",
                      }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {item.product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Category: {item.product.category}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Quantity: {item.quantity} x ${item.price.toFixed(2)}
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        ${(item.quantity * item.price).toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Order Summary */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <DollarSign size={18} />
                  Total Amount
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: "primary.main" }}>
                  ${selectedOrder.totalAmount.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            startIcon={<Printer size={16} />}
            onClick={() => selectedOrder && handlePrintInvoice(selectedOrder)}>
            Print Invoice
          </Button>
          <Button onClick={() => setViewDetailsDialog(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default OrdersTable;
