import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./auth/AuthContext";
import { ToastProvider } from "./shared/components/Toast";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { LoginPage } from "./auth/LoginPage";
import { RegisterPage } from "./auth/RegisterPage";
import { AppShell } from "./shared/components/AppShell";
import { DashboardPage } from "./dashboard/DashboardPage";
import { LogsPage } from "./logs/LogsPage";
import { LogDetailPage } from "./logs/LogDetailPage";
import { LogBuilderPage } from "./builder/LogBuilderPage";
import { RelationshipsPage } from "./logs/RelationshipsPage";
import { RecordsPage } from "./records/RecordsPage";
import { RecordDetailPage } from "./records/RecordDetailPage";
import { AuditPage } from "./audit/AuditPage";
import { UsersPage } from "./personnel/UsersPage";
import { PersonnelPage } from "./personnel/PersonnelPage";

// ─── Page titles ──────────────────────────────────────────────────────────────

const TITLE_MAP: Record<string, string> = {
  "/": "Dashboard",
  "/logs": "Logs",
  "/relationships": "Relationships",
  "/personnel": "Personnel",
  "/users": "Users",
  "/audit": "Audit Trail",
  "/login": "Sign In",
  "/register": "Create Organisation",
};

function PageTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Exact match first, then prefix match for dynamic routes
    const exact = TITLE_MAP[pathname];
    if (exact) {
      document.title = `${exact} — Logbook Builder`;
      return;
    }
    if (pathname.includes("/records/") && pathname.split("/").length > 5) {
      document.title = "Record Detail — Logbook Builder";
    } else if (pathname.includes("/records")) {
      document.title = "Records — Logbook Builder";
    } else if (pathname.endsWith("/edit")) {
      document.title = "Edit Log — Logbook Builder";
    } else if (pathname.includes("/logs/new")) {
      document.title = "New Log — Logbook Builder";
    } else if (pathname.startsWith("/logs/")) {
      document.title = "Log Detail — Logbook Builder";
    } else {
      document.title = "Logbook Builder";
    }
  }, [pathname]);
  return null;
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <PageTitle />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <Routes>
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/logs" element={<LogsPage />} />
                      <Route path="/logs/new" element={<LogBuilderPage />} />
                      <Route path="/logs/:id" element={<LogDetailPage />} />
                      <Route
                        path="/logs/:id/edit"
                        element={<LogBuilderPage />}
                      />
                      <Route
                        path="/logs/:id/records"
                        element={<RecordsPage />}
                      />
                      <Route
                        path="/logs/:logId/records/:recordId"
                        element={<RecordDetailPage />}
                      />
                      <Route
                        path="/relationships"
                        element={<RelationshipsPage />}
                      />
                      <Route path="/users" element={<UsersPage />} />
                      <Route path="/personnel" element={<PersonnelPage />} />
                      <Route path="/audit" element={<AuditPage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </AppShell>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
