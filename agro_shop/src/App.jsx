import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";

import ProtectedRoute from "./components/layout/ProtectedRoute";
import AppShell from "./components/layout/AppShell";
import Login from "./pages/Login";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Inventory = lazy(() => import("./pages/Inventory"));
const POS = lazy(() => import("./pages/POS"));
const Sales = lazy(() => import("./pages/Sales"));
const Purchasing = lazy(() => import("./pages/Purchasing"));
const Suppliers = lazy(() => import("./pages/Suppliers"));
const Customers = lazy(() => import("./pages/Customers"));
const Expenses = lazy(() => import("./pages/Expenses"));
const Reports = lazy(() => import("./pages/Reports"));
const Settings = lazy(() => import("./pages/Settings"));

const Loader = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "60vh",
    }}
  >
    <span style={{ color: "var(--brand)", fontWeight: 700 }}>Loading…</span>
  </div>
);

export default function App() {
  const { initialize, user } = useAuthStore();
  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Routes>
      {/* Public — redirect to dashboard if already logged in */}
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Protected pages — all wrapped in AppShell */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppShell>
              <Suspense fallback={<Loader />}>
                <Dashboard />
              </Suspense>
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <AppShell>
              <Suspense fallback={<Loader />}>
                <Inventory />
              </Suspense>
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pos"
        element={
          <ProtectedRoute allowedRoles={["admin", "manager", "cashier"]}>
            <AppShell>
              <Suspense fallback={<Loader />}>
                <POS />
              </Suspense>
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/sales"
        element={
          <ProtectedRoute>
            <AppShell>
              <Suspense fallback={<Loader />}>
                <Sales />
              </Suspense>
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/purchasing"
        element={
          <ProtectedRoute allowedRoles={["admin", "manager"]}>
            <AppShell>
              <Suspense fallback={<Loader />}>
                <Purchasing />
              </Suspense>
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/suppliers"
        element={
          <ProtectedRoute allowedRoles={["admin", "manager"]}>
            <AppShell>
              <Suspense fallback={<Loader />}>
                <Suppliers />
              </Suspense>
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/customers"
        element={
          <ProtectedRoute allowedRoles={["admin", "manager"]}>
            <AppShell>
              <Suspense fallback={<Loader />}>
                <Customers />
              </Suspense>
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/expenses"
        element={
          <ProtectedRoute allowedRoles={["admin", "manager"]}>
            <AppShell>
              <Suspense fallback={<Loader />}>
                <Expenses />
              </Suspense>
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute allowedRoles={["admin", "manager"]}>
            <AppShell>
              <Suspense fallback={<Loader />}>
                <Reports />
              </Suspense>
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AppShell>
              <Suspense fallback={<Loader />}>
                <Settings />
              </Suspense>
            </AppShell>
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
