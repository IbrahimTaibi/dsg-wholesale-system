import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Fade,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  MapPin,
  Phone,
  Search,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { apiService, User as ApiUser } from "../config/api";
import useDebounce from "../hooks/useDebounce";
import { useTranslation } from "react-i18next";

// Define the AdminUser interface for the admin interface to avoid conflicts
interface AdminUser {
  _id: string;
  name: string;
  phone: string;
  storeName: string;
  photo?: string;
  role: "user" | "admin";
  isActive?: boolean;
  createdAt: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

interface UserFormData {
  name: string;
  phone: string;
  storeName: string;
  role: "user" | "admin";
  password: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

// Users Management Page Component
const UsersManagementPage: React.FC = () => {
  const { user: authUser } = useAuth();
  const { t } = useTranslation();
  const [allUsers, setAllUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [viewingUser, setViewingUser] = useState<AdminUser | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [visiblePhones, setVisiblePhones] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    phone: "",
    storeName: "",
    role: "user",
    password: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getAllUsers({
        page: page + 1,
        limit: rowsPerPage,
      });
      // Convert API users to our extended AdminUser type
      const extendedUsers: AdminUser[] = response.users.map(
        (apiUser: ApiUser) => ({
          ...apiUser,
          role: (apiUser.role as "user" | "admin") || "user",
          storeName: apiUser.storeName || "",
          isActive: true, // Default to active since API doesn't provide this
          createdAt: new Date().toISOString(), // Default since API doesn't provide this
          address: apiUser.address || {
            street: "",
            city: "",
            state: "",
            zipCode: "",
          },
        }),
      );
      setAllUsers(extendedUsers);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("failedToLoadUsers"));
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, t]);

  useEffect(() => {
    if (authUser?.role === "admin") {
      fetchUsers();
    }
  }, [authUser, fetchUsers]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (user?: AdminUser) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        phone: user.phone,
        storeName: user.storeName,
        role: user.role,
        password: "",
        address: user.address,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: "",
        phone: "",
        storeName: "",
        role: "user",
        password: "",
        address: {
          street: "",
          city: "",
          state: "",
          zipCode: "",
        },
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
    setFormData({
      name: "",
      phone: "",
      storeName: "",
      role: "user",
      password: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
      },
    });
  };

  const handleSubmit = async () => {
    setActionLoading(true);
    try {
      if (editingUser) {
        await apiService.updateUser(editingUser._id, {
          name: formData.name,
          phone: formData.phone,
          storeName: formData.storeName,
          role: formData.role,
          address: formData.address,
        });
      } else {
        await apiService.createUser({
          name: formData.name,
          phone: formData.phone,
          storeName: formData.storeName,
          role: formData.role,
          password: formData.password,
          address: formData.address,
        });
      }
      handleCloseDialog();
      fetchUsers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("failedToSaveUser"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteDialog) return;
    setActionLoading(true);
    try {
      await apiService.deleteUser(deleteDialog);
      setDeleteDialog(null);
      fetchUsers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("failedToDeleteUser"));
    } finally {
      setActionLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    return role === "admin" ? "error" : "default";
  };

  const handleCheckMap = (address: AdminUser["address"]) => {
    const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
    const encodedAddress = encodeURIComponent(fullAddress);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(googleMapsUrl, "_blank");
  };

  const handleTogglePhone = (userId: string) => {
    setVisiblePhones((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  // Filter users based on search query
  const filteredUsers = allUsers.filter((user) => {
    const searchLower = debouncedSearchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.phone.toLowerCase().includes(searchLower) ||
      user.storeName.toLowerCase().includes(searchLower)
    );
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (authUser?.role !== "admin") {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" align="center" sx={{ mt: 8 }}>
          {t("accessDenied")}
        </Typography>
        <Typography align="center" sx={{ color: "text.secondary", mb: 4 }}>
          {t("noAccessPermission")}
        </Typography>
      </Container>
    );
  }

  return (
    <Box
      sx={{ bgcolor: "background.default", pt: 10, pb: 4, minHeight: "100vh" }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Fade in timeout={800}>
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 4,
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
              }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Users size={32} className="mr-3 text-primary" />
                <Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: "text.primary",
                      fontSize: { xs: "1.5rem", md: "2.125rem" },
                    }}>
                    {t("usersManagement")}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 400,
                      fontSize: { xs: "0.875rem", md: "1.25rem" },
                    }}>
                    {t("manageUserRoles")}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Tooltip title={t("refreshUsers")}>
                  <IconButton
                    onClick={fetchUsers}
                    disabled={loading}
                    sx={{ color: "primary.main" }}>
                    <RefreshCw
                      size={20}
                      className={loading ? "animate-spin" : ""}
                    />
                  </IconButton>
                </Tooltip>
                <Button
                  variant="contained"
                  startIcon={<Plus size={20} />}
                  onClick={() => handleOpenDialog()}
                  sx={{
                    background:
                      "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                    color: "white",
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)",
                    },
                  }}>
                  {t("addNewUser")}
                </Button>
              </Box>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 4 }}>
                {error}
              </Alert>
            )}

            {/* Search Bar */}
            <Paper sx={{ p: 2, mb: 3 }}>
              <TextField
                fullWidth
                placeholder={t("searchUsers")}
                value={searchQuery}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1, color: "text.secondary" }}>
                      <Search size={20} />
                    </Box>
                  ),
                }}
                sx={{ maxWidth: 400 }}
              />
            </Paper>

            <Paper sx={{ p: 3 }}>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                  <CircularProgress size={60} />
                </Box>
              ) : (
                <>
                  {isMobile ? (
                    // Mobile Card Layout
                    <Box sx={{ overflowX: "auto", pb: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                          minWidth: "320px",
                        }}>
                        {filteredUsers
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage,
                          )
                          .map((user) => (
                            <Paper
                              key={user._id}
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                border: "1px solid rgba(0,0,0,0.08)",
                              }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "flex-start",
                                  mb: 1,
                                }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    flex: 1,
                                  }}>
                                  <Avatar
                                    src={user.photo}
                                    alt={user.name}
                                    sx={{ width: 48, height: 48 }}>
                                    {user.name.charAt(0)}
                                  </Avatar>
                                  <Box>
                                    <Typography
                                      variant="h6"
                                      fontWeight="bold"
                                      sx={{ fontSize: "1rem", mb: 0.5 }}>
                                      {user.name}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{ mb: 1 }}>
                                      {user.storeName}
                                    </Typography>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        mb: 1,
                                      }}>
                                      {visiblePhones.has(user._id) ? (
                                        <>
                                          <Typography
                                            variant="body2"
                                            sx={{ fontSize: "0.875rem" }}>
                                            {user.phone}
                                          </Typography>
                                          <IconButton
                                            onClick={() =>
                                              handleTogglePhone(user._id)
                                            }
                                            size="small"
                                            sx={{ padding: "2px" }}>
                                            <Phone size={14} />
                                          </IconButton>
                                        </>
                                      ) : (
                                        <IconButton
                                          onClick={() =>
                                            handleTogglePhone(user._id)
                                          }
                                          size="small"
                                          sx={{ padding: "2px" }}>
                                          <Phone size={16} />
                                        </IconButton>
                                      )}
                                    </Box>
                                    <Chip
                                      label={user.role}
                                      color={
                                        getRoleColor(user.role) as
                                          | "default"
                                          | "error"
                                      }
                                      size="small"
                                      sx={{ fontSize: "0.75rem" }}
                                    />
                                  </Box>
                                </Box>
                                <Box sx={{ display: "flex", gap: 0.5 }}>
                                  <Tooltip title="View Details">
                                    <IconButton
                                      onClick={() => setViewingUser(user)}
                                      size="small"
                                      sx={{ padding: "4px" }}>
                                      <Eye size={16} />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Edit User">
                                    <IconButton
                                      onClick={() => handleOpenDialog(user)}
                                      size="small"
                                      sx={{ padding: "4px" }}>
                                      <Edit size={16} />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete User">
                                    <IconButton
                                      onClick={() => setDeleteDialog(user._id)}
                                      disabled={user._id === authUser?.id}
                                      size="small"
                                      color="error"
                                      sx={{ padding: "4px" }}>
                                      <Trash2 size={16} />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </Box>
                            </Paper>
                          ))}
                      </Box>
                    </Box>
                  ) : (
                    // Desktop Table Layout
                    <TableContainer sx={{ maxWidth: "100%" }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Photo</TableCell>
                            <TableCell>{t("user")}</TableCell>
                            <TableCell>{t("phone")}</TableCell>
                            <TableCell>{t("store")}</TableCell>
                            <TableCell>{t("role")}</TableCell>
                            <TableCell>{t("actions")}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredUsers
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage,
                            )
                            .map((user) => (
                              <TableRow key={user._id} hover>
                                <TableCell>
                                  <Avatar
                                    src={user.photo}
                                    alt={user.name}
                                    sx={{ width: 40, height: 40 }}>
                                    {user.name.charAt(0)}
                                  </Avatar>
                                </TableCell>
                                <TableCell sx={{ wordBreak: "break-word" }}>
                                  {user.name}
                                </TableCell>
                                <TableCell sx={{ wordBreak: "break-word" }}>
                                  {user.phone}
                                </TableCell>
                                <TableCell sx={{ wordBreak: "break-word" }}>
                                  {user.storeName}
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={user.role}
                                    color={
                                      getRoleColor(user.role) as
                                        | "default"
                                        | "error"
                                    }
                                    size="small"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      gap: 0.5,
                                      flexWrap: "wrap",
                                    }}>
                                    <Tooltip title="View Details">
                                      <IconButton
                                        onClick={() => setViewingUser(user)}
                                        size="small">
                                        <Eye size={16} />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit User">
                                      <IconButton
                                        onClick={() => handleOpenDialog(user)}
                                        size="small">
                                        <Edit size={16} />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete User">
                                      <IconButton
                                        onClick={() =>
                                          setDeleteDialog(user._id)
                                        }
                                        disabled={user._id === authUser?.id}
                                        size="small"
                                        color="error">
                                        <Trash2 size={16} />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                  <Box sx={{ width: "100%", overflowX: "auto" }}>
                    <TablePagination
                      component="div"
                      count={filteredUsers.length}
                      page={page}
                      onPageChange={handleChangePage}
                      rowsPerPage={rowsPerPage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      sx={{
                        ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                          {
                            fontSize: isMobile ? "0.75rem" : "inherit",
                          },
                      }}
                    />
                  </Box>
                </>
              )}
            </Paper>
          </Box>
        </Fade>

        {/* Add/Edit User Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth>
          <DialogTitle>
            {editingUser ? "Edit User" : "Add New User"}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 2,
                mt: 2,
              }}>
              <TextField
                label="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                fullWidth
                required
              />
              <TextField
                label="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                fullWidth
                required
              />
              <TextField
                label="Store Name"
                value={formData.storeName}
                onChange={(e) =>
                  setFormData({ ...formData, storeName: e.target.value })
                }
                fullWidth
                required
              />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as "user" | "admin",
                    })
                  }
                  label="Role">
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
              {!editingUser && (
                <TextField
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  fullWidth
                  required
                />
              )}
              <TextField
                label="Street Address"
                value={formData.address.street}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, street: e.target.value },
                  })
                }
                fullWidth
                required
              />
              <TextField
                label="City"
                value={formData.address.city}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, city: e.target.value },
                  })
                }
                fullWidth
                required
              />
              <TextField
                label="State"
                value={formData.address.state}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, state: e.target.value },
                  })
                }
                fullWidth
                required
              />
              <TextField
                label="Zip Code"
                value={formData.address.zipCode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, zipCode: e.target.value },
                  })
                }
                fullWidth
                required
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={actionLoading}>
              {actionLoading ? "Saving..." : editingUser ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* View User Details Dialog */}
        <Dialog
          open={!!viewingUser}
          onClose={() => setViewingUser(null)}
          maxWidth="sm"
          fullWidth>
          <DialogTitle>User Details</DialogTitle>
          <DialogContent>
            {viewingUser && (
              <Box sx={{ mt: 2 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Avatar
                    src={viewingUser.photo}
                    alt={viewingUser.name}
                    sx={{ width: 64, height: 64 }}>
                    {viewingUser.name.charAt(0)}
                  </Avatar>
                  <Typography variant="h6" gutterBottom>
                    {viewingUser.name}
                  </Typography>
                </Box>
                <Typography gutterBottom>
                  <strong>Phone:</strong> {viewingUser.phone}
                </Typography>
                <Typography gutterBottom>
                  <strong>Store:</strong> {viewingUser.storeName}
                </Typography>
                <Typography gutterBottom>
                  <strong>Role:</strong> {viewingUser.role}
                </Typography>
                <Typography gutterBottom>
                  <strong>Status:</strong>{" "}
                  {viewingUser.isActive ? "Active" : "Inactive"}
                </Typography>
                <Typography gutterBottom>
                  <strong>Address:</strong>
                </Typography>
                <Box sx={{ ml: 2, mb: 2 }}>
                  <Typography>{viewingUser.address.street}</Typography>
                  <Typography>
                    {viewingUser.address.city}, {viewingUser.address.state}{" "}
                    {viewingUser.address.zipCode}
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<MapPin size={16} />}
                    onClick={() => handleCheckMap(viewingUser.address)}
                    sx={{ mt: 1 }}
                    size="small">
                    Check Map
                  </Button>
                </Box>
                <Typography gutterBottom>
                  <strong>Created:</strong>{" "}
                  {new Date(viewingUser.createdAt).toLocaleString()}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewingUser(null)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteDialog} onClose={() => setDeleteDialog(null)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog(null)}>Cancel</Button>
            <Button
              onClick={handleDeleteUser}
              color="error"
              variant="contained"
              disabled={actionLoading}>
              {actionLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default UsersManagementPage;
export { UsersManagementPage };
