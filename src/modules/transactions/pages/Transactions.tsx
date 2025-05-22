"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

// Material UI Components
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
  Tooltip,
  Fade,
  Zoom,
  alpha,
  Skeleton,
  Avatar,
  ButtonGroup,
} from "@mui/material";

// Lucide React Icons
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  User,
  Users,
  Home,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  RefreshCw,
} from "lucide-react";

// Define types for our data
interface Transaction {
  id: string;
  name: string;
  buyer: string;
  seller: string;
  propertyAddress: string;
  status: TransactionStatus;
}

// Define a type for the possible transaction statuses
type TransactionStatus = "Draft" | "Sent" | "Signed" | string;

// Define a type for the possible chip colors
type ChipColor =
  | "success"
  | "warning"
  | "info"
  | "default"
  | "primary"
  | "secondary"
  | "error";

// Define a type for the snackbar state
interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "info" | "warning" | "error";
}

// Mock data for demonstration
const initialTransactions: Transaction[] = [
  {
    id: "tx1",
    name: "Downtown Condo Sale",
    buyer: "John Smith",
    seller: "Emma Johnson",
    propertyAddress: "123 Main St, Apt 4B, New York, NY 10001",
    status: "Draft",
  },
  {
    id: "tx2",
    name: "Lakefront Property",
    buyer: "Michael Brown",
    seller: "Sarah Davis",
    propertyAddress: "456 Lake View Dr, Chicago, IL 60611",
    status: "Signed",
  },
  {
    id: "tx3",
    name: "Commercial Office Space",
    buyer: "Tech Innovations LLC",
    seller: "Property Holdings Inc",
    propertyAddress: "789 Business Park, Suite 300, San Francisco, CA 94107",
    status: "Sent",
  },
  {
    id: "tx4",
    name: "Suburban Family Home",
    buyer: "David & Lisa Wilson",
    seller: "Robert Taylor",
    propertyAddress: "321 Oak Lane, Austin, TX 78701",
    status: "Draft",
  },
];

// Status options for the filter
const statusOptions = ["All", "Draft", "Sent", "Signed"];

// Local storage key
const STORAGE_KEY = "transactionListData";

// Get chip color based on status
const getStatusColor = (status: TransactionStatus): ChipColor => {
  switch (status.toLowerCase()) {
    case "signed":
      return "success";
    case "draft":
      return "warning";
    case "sent":
      return "info";
    default:
      return "default";
  }
};

// Get status icon based on status
const getStatusIcon = (status: TransactionStatus) => {
  switch (status.toLowerCase()) {
    case "signed":
      return <CheckCircle2 size={16} />;
    case "draft":
      return <FileText size={16} />;
    case "sent":
      return <Clock size={16} />;
    default:
      return <AlertCircle size={16} />;
  }
};

const TransactionList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // State management
  const [viewType, setViewType] = useState<"all" | "buyer" | "seller">("all");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Snackbar state
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);

    // Simulate loading
    setTimeout(() => {
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setTransactions(parsedData);
        } catch (error) {
          console.error("Error loading data from localStorage:", error);
          setTransactions(initialTransactions);
        }
      } else {
        setTransactions(initialTransactions);
      }
      setLoading(false);
    }, 800);
  }, []);

  // Save data to localStorage whenever transactions change
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    }
  }, [transactions]);

  // Filter transactions based on viewType, statusFilter, and searchQuery
  useEffect(() => {
    let filtered = transactions;

    // Filter by view type (all, buyer, seller)
    if (viewType !== "all") {
      filtered = filtered.filter((tx) =>
        viewType === "buyer" ? tx.buyer : tx.seller
      );
    }

    // Filter by status
    if (statusFilter !== "All") {
      filtered = filtered.filter((tx) => tx.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tx) =>
          tx.name.toLowerCase().includes(query) ||
          tx.propertyAddress.toLowerCase().includes(query) ||
          tx.buyer.toLowerCase().includes(query) ||
          tx.seller.toLowerCase().includes(query)
      );
    }

    setFilteredTransactions(filtered);
  }, [viewType, statusFilter, searchQuery, transactions]);

  // Handle actions
  const handleDelete = (id: string) => {
    setTransactions(transactions.filter((tx) => tx.id !== id));
    setSnackbar({
      open: true,
      message: "Transaction deleted successfully",
      severity: "success",
    });
  };

  const handleEdit = (id: string) => {
    // In a real app, this would navigate to edit page or open a modal
    setSnackbar({
      open: true,
      message: `Editing transaction ${id}`,
      severity: "info",
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Reset localStorage data
  const handleResetData = () => {
    setTransactions(initialTransactions);
    setSnackbar({
      open: true,
      message: "Data has been reset to initial values",
      severity: "info",
    });
  };

  // Handle view type change
  const handleViewTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newViewType: "all" | "buyer" | "seller" | null
  ) => {
    if (newViewType !== null) {
      setViewType(newViewType);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Header with title and actions */}
      <Paper
        elevation={2}
        sx={{
          p: { xs: 2, md: 3 },
          mb: 3,
          borderRadius: 2,
          background: theme.palette.background.paper,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              color="primary.main"
              gutterBottom
              sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}
            >
              Transaction Management
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage your real estate transactions
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            onClick={handleResetData}
            startIcon={<RefreshCw size={16} />}
            sx={{
              borderRadius: 1.5,
              textTransform: "none",
              boxShadow: "none",
            }}
          >
            Reset Data
          </Button>
        </Box>

        {/* Filters and Actions */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            alignItems: { xs: "stretch", md: "center" },
            mb: 3,
            width: "100%",
          }}
        >
          {/* Search Bar */}
          <TextField
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} />
                </InputAdornment>
              ),
            }}
            size="small"
            sx={{
              flexGrow: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                height: 40,
              },
            }}
          />

          {/* View Type Toggle */}
          <ButtonGroup
            variant="outlined"
            sx={{
              height: 40,
              "& .MuiButtonGroup-grouped": {
                minWidth: 90,
              },
            }}
          >
            <Button
              variant={viewType === "all" ? "contained" : "outlined"}
              onClick={(e) => handleViewTypeChange(e, "all")}
              startIcon={<Users size={16} />}
              sx={{ borderRadius: "8px 0 0 8px" }}
            >
              All
            </Button>
            <Button
              variant={viewType === "buyer" ? "contained" : "outlined"}
              onClick={(e) => handleViewTypeChange(e, "buyer")}
              startIcon={<User size={16} />}
            >
              Buyer
            </Button>
            <Button
              variant={viewType === "seller" ? "contained" : "outlined"}
              onClick={(e) => handleViewTypeChange(e, "seller")}
              startIcon={<Home size={16} />}
              sx={{ borderRadius: "0 8px 8px 0" }}
            >
              Seller
            </Button>
          </ButtonGroup>

          {/* Status Filter */}
          <FormControl size="small" sx={{ minWidth: 150, height: 40 }}>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              displayEmpty
              renderValue={(selected) => {
                if (!selected || selected === "All") {
                  return (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Filter size={16} />
                      <Typography>Status: All</Typography>
                    </Box>
                  );
                }
                return (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      component="span"
                      sx={{
                        display: "inline-block",
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: getStatusColor(selected),
                      }}
                    />
                    <Typography>Status: {selected}</Typography>
                  </Box>
                );
              }}
              sx={{
                height: 40,
                borderRadius: 2,
                "& .MuiSelect-select": {
                  paddingY: "8px",
                  display: "flex",
                  alignItems: "center",
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    borderRadius: 2,
                    mt: 0.5,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  },
                },
              }}
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {status !== "All" && (
                      <Box
                        component="span"
                        sx={{
                          display: "inline-block",
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: getStatusColor(status),
                        }}
                      />
                    )}
                    {status}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Create Button */}
          <Button
            component={Link}
            to={ROUTES.CREATE_TRANSACTION}
            variant="contained"
            startIcon={<Plus size={18} />}
            sx={{
              borderRadius: 2,
              height: 40,
              whiteSpace: "nowrap",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              fontWeight: 500,
            }}
          >
            Create Transaction
          </Button>
        </Box>
      </Paper>

      {/* Loading State */}
      {loading && (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          {!isMobile ? (
            <Box>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={40}
                sx={{ mb: 2 }}
              />
              {[1, 2, 3].map((item) => (
                <Skeleton
                  key={item}
                  variant="rectangular"
                  width="100%"
                  height={60}
                  sx={{ mb: 1 }}
                />
              ))}
            </Box>
          ) : (
            <Stack spacing={2}>
              {[1, 2].map((item) => (
                <Box key={item}>
                  <Skeleton
                    variant="rectangular"
                    width="70%"
                    height={24}
                    sx={{ mb: 1 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    width="40%"
                    height={20}
                    sx={{ mb: 1 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={80}
                    sx={{ mb: 1 }}
                  />
                  <Skeleton variant="rectangular" width="30%" height={30} />
                </Box>
              ))}
            </Stack>
          )}
        </Paper>
      )}

      {/* Desktop View - Table */}
      {!loading && !isMobile && (
        <Paper
          elevation={2}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            transition: "all 0.3s ease",
          }}
        >
          <TableContainer>
            <Table aria-label="transactions table">
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  }}
                >
                  <TableCell sx={{ fontWeight: 600 }}>Transaction</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Buyer / Seller</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    Property Address
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTransactions.map((transaction, index) => (
                  <TableRow
                    key={transaction.id}
                    hover
                    sx={{
                      backgroundColor:
                        index % 2 === 0
                          ? "transparent"
                          : alpha(theme.palette.background.default, 0.5),
                      "&:hover": {
                        backgroundColor: alpha(
                          theme.palette.primary.main,
                          0.03
                        ),
                      },
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                          }}
                        >
                          {transaction.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight={500}>
                            {transaction.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block" }}
                          >
                            ID: {transaction.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <Box
                          component="span"
                          sx={{
                            fontWeight: 500,
                            color: theme.palette.text.secondary,
                            mr: 0.5,
                          }}
                        >
                          Buyer:
                        </Box>
                        {transaction.buyer}
                      </Typography>
                      <Typography variant="body2">
                        <Box
                          component="span"
                          sx={{
                            fontWeight: 500,
                            color: theme.palette.text.secondary,
                            mr: 0.5,
                          }}
                        >
                          Seller:
                        </Box>
                        {transaction.seller}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={transaction.propertyAddress} arrow>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 300,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Home
                            size={16}
                            color={theme.palette.text.secondary}
                          />
                          {transaction.propertyAddress}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(transaction.status)}
                        label={transaction.status}
                        color={getStatusColor(transaction.status)}
                        size="small"
                        sx={{
                          borderRadius: 1,
                          fontWeight: 500,
                          "& .MuiChip-icon": {
                            ml: 0.5,
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 0.5,
                        }}
                      >
                        <Tooltip title="Edit transaction" arrow>
                          <IconButton
                            aria-label="edit transaction"
                            onClick={() => handleEdit(transaction.id)}
                            color="primary"
                            size="small"
                            sx={{
                              backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.1
                              ),
                              "&:hover": {
                                backgroundColor: alpha(
                                  theme.palette.primary.main,
                                  0.2
                                ),
                              },
                            }}
                          >
                            <Edit size={18} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete transaction" arrow>
                          <IconButton
                            aria-label="delete transaction"
                            onClick={() => handleDelete(transaction.id)}
                            color="error"
                            size="small"
                            sx={{
                              backgroundColor: alpha(
                                theme.palette.error.main,
                                0.1
                              ),
                              "&:hover": {
                                backgroundColor: alpha(
                                  theme.palette.error.main,
                                  0.2
                                ),
                              },
                            }}
                          >
                            <Trash2 size={18} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Mobile View - Cards */}
      {!loading && isMobile && (
        <Stack spacing={2}>
          {filteredTransactions.map((transaction) => (
            <Zoom
              key={transaction.id}
              in={true}
              style={{ transitionDelay: "100ms" }}
            >
              <Card
                elevation={2}
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                        }}
                      >
                        {transaction.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {transaction.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {transaction.id}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      icon={getStatusIcon(transaction.status)}
                      label={transaction.status}
                      color={getStatusColor(transaction.status)}
                      size="small"
                      sx={{
                        borderRadius: 1,
                        fontWeight: 500,
                        "& .MuiChip-icon": {
                          ml: 0.5,
                        },
                      }}
                    />
                  </Box>

                  <Stack
                    spacing={1.5}
                    sx={{
                      mb: 2,
                      p: 1.5,
                      borderRadius: 1.5,
                      backgroundColor: alpha(
                        theme.palette.background.default,
                        0.5
                      ),
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
                    >
                      <User
                        size={18}
                        color={theme.palette.primary.main}
                        style={{ marginTop: 2 }}
                      />
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight={500}
                        >
                          Buyer
                        </Typography>
                        <Typography variant="body1">
                          {transaction.buyer}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
                    >
                      <Home
                        size={18}
                        color={theme.palette.secondary.main}
                        style={{ marginTop: 2 }}
                      />
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight={500}
                        >
                          Seller
                        </Typography>
                        <Typography variant="body1">
                          {transaction.seller}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
                    >
                      <FileText
                        size={18}
                        color={theme.palette.info.main}
                        style={{ marginTop: 2 }}
                      />
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight={500}
                        >
                          Property Address
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ wordBreak: "break-word" }}
                        >
                          {transaction.propertyAddress}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 1.5 }} />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    <Button
                      startIcon={<Edit size={16} />}
                      onClick={() => handleEdit(transaction.id)}
                      variant="outlined"
                      color="primary"
                      size="small"
                      sx={{
                        borderRadius: 1.5,
                        textTransform: "none",
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      startIcon={<Trash2 size={16} />}
                      onClick={() => handleDelete(transaction.id)}
                      variant="outlined"
                      color="error"
                      size="small"
                      sx={{
                        borderRadius: 1.5,
                        textTransform: "none",
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          ))}
        </Stack>
      )}

      {/* Empty State */}
      {!loading && filteredTransactions.length === 0 && (
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
          }}
          elevation={2}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              p: 3,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <FileText size={40} color={theme.palette.primary.main} />
            </Box>
            <Typography variant="h6" color="text.primary" gutterBottom>
              No transactions found
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 400, mb: 2 }}
            >
              {searchQuery || statusFilter !== "All" || viewType !== "all"
                ? "Try adjusting your filters to see more results"
                : "Create your first transaction to get started"}
            </Typography>
            <Button
              component={Link}
              to={ROUTES.CREATE_TRANSACTION}
              variant="contained"
              startIcon={<Plus size={18} />}
              sx={{
                borderRadius: 1.5,
                py: 1,
                px: 3,
                textTransform: "none",
                boxShadow: theme.shadows[2],
              }}
            >
              Create your first transaction
            </Button>
          </Box>
        </Paper>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={Fade}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: 1.5,
            boxShadow: theme.shadows[3],
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TransactionList;
