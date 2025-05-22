import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import withSuspenseAndErrorBoundary from "@/hocs/withSuspenseAndErrorBoundary";
import MainLayout from "@/core/layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import { ROUTES } from "@/constants/routes";

// Lazy-loaded pages from transactions module
const Login = withSuspenseAndErrorBoundary(
  lazy(() => import("@/modules/login/pages/Login"))
);
const Dashboard = withSuspenseAndErrorBoundary(
  lazy(() => import("@/modules/dashboard/pages/Dashboard"))
);
const TransactionList = withSuspenseAndErrorBoundary(
  lazy(() => import("@/modules/transactions/pages/Transactions"))
);
const CreateTransaction = withSuspenseAndErrorBoundary(
  lazy(() => import("@/modules/transactions/pages/CreateTransaction"))
);
// const EditTransaction = withSuspenseAndErrorBoundary(
//   lazy(() => import("@/modules/transactions/pages/EditTransaction"))
// );

// (Optional) Error fallback page
const NotFound = withSuspenseAndErrorBoundary(
  lazy(() => import("@/core/components/ErrorPages/NotFound"))
);

const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <Login />,
  },
  {
    element: <ProtectedRoute layout={MainLayout} />,
    errorElement: <NotFound />,
    children: [
      { path: ROUTES.ROOT, element: <TransactionList /> },
      { path: ROUTES.TRANSACTIONS, element: <TransactionList /> },
      { path: ROUTES.CREATE_TRANSACTION, element: <CreateTransaction /> },
      // { path: ROUTES.EDIT_TRANSACTION, element: <EditTransaction /> },
      { path: ROUTES.DASHBOARD, element: <Dashboard /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
