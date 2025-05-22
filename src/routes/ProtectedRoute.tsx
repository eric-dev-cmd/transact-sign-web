import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/modules/login/stores/useAuthStore";
import type React from "react";
import { Navigate, Outlet } from "react-router-dom";

type Props = {
  layout: React.ComponentType<{ children: React.ReactNode }>;
};

const ProtectedRoute = ({ layout: Layout }: Props) => {
  // Get authentication state from Zustand store
  const { isAuthenticated } = useAuthStore();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // If authenticated, render the layout with children
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default ProtectedRoute;
