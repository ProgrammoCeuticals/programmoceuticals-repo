import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { PrivateRoute } from "./components/PrivateRoute";
import { AppShell } from "./layouts/AppShell";
import { Spinner } from "@rims/ui";

function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

function wrap(Component: React.LazyExoticComponent<() => JSX.Element>) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

// Auth pages
const LoginPage = lazy(() =>
  import("./pages/auth/LoginPage").then((m) => ({ default: m.LoginPage })),
);
const ForgotPasswordPage = lazy(() =>
  import("./pages/auth/ForgotPasswordPage").then((m) => ({
    default: m.ForgotPasswordPage,
  })),
);
const ResetPasswordPage = lazy(() =>
  import("./pages/auth/ResetPasswordPage").then((m) => ({
    default: m.ResetPasswordPage,
  })),
);
const AcceptInvitationPage = lazy(() =>
  import("./pages/auth/AcceptInvitationPage").then((m) => ({
    default: m.AcceptInvitationPage,
  })),
);

// Authenticated pages
const DashboardPage = lazy(() =>
  import("./pages/dashboard/DashboardPage").then((m) => ({
    default: m.DashboardPage,
  })),
);
const UsersPage = lazy(() =>
  import("./pages/users/UsersPage").then((m) => ({ default: m.UsersPage })),
);
const UserDetailPage = lazy(() =>
  import("./pages/users/UserDetailPage").then((m) => ({
    default: m.UserDetailPage,
  })),
);
const RolesPage = lazy(() =>
  import("./pages/roles/RolesPage").then((m) => ({ default: m.RolesPage })),
);
const RoleDetailPage = lazy(() =>
  import("./pages/roles/RoleDetailPage").then((m) => ({
    default: m.RoleDetailPage,
  })),
);
const InstitutionPage = lazy(() =>
  import("./pages/institution/InstitutionPage").then((m) => ({
    default: m.InstitutionPage,
  })),
);
const DepartmentsPage = lazy(() =>
  import("./pages/departments/DepartmentsPage").then((m) => ({
    default: m.DepartmentsPage,
  })),
);
const DepartmentDetailPage = lazy(() =>
  import("./pages/departments/DepartmentDetailPage").then((m) => ({
    default: m.DepartmentDetailPage,
  })),
);
const TeamsPage = lazy(() =>
  import("./pages/teams/TeamsPage").then((m) => ({ default: m.TeamsPage })),
);
const EmployeesPage = lazy(() =>
  import("./pages/employees/EmployeesPage").then((m) => ({
    default: m.EmployeesPage,
  })),
);
const EmployeeDetailPage = lazy(() =>
  import("./pages/employees/EmployeeDetailPage").then((m) => ({
    default: m.EmployeeDetailPage,
  })),
);
const AuditPage = lazy(() =>
  import("./pages/audit/AuditPage").then((m) => ({ default: m.AuditPage })),
);

// Research pages
const ResearchProjectsPage = lazy(() =>
  import("./pages/research/ResearchProjectsPage").then((m) => ({
    default: m.ResearchProjectsPage,
  })),
);
const ResearchProjectDetailPage = lazy(() =>
  import("./pages/research/ResearchProjectDetailPage").then((m) => ({
    default: m.ResearchProjectDetailPage,
  })),
);

// Task pages
const TasksPage = lazy(() =>
  import("./pages/tasks/TasksPage").then((m) => ({ default: m.TasksPage })),
);
const TaskDetailPage = lazy(() =>
  import("./pages/tasks/TaskDetailPage").then((m) => ({
    default: m.TaskDetailPage,
  })),
);

// Performance pages
const PerformanceCyclesPage = lazy(() =>
  import("./pages/performance/PerformanceCyclesPage").then((m) => ({
    default: m.PerformanceCyclesPage,
  })),
);
const PerformanceCycleDetailPage = lazy(() =>
  import("./pages/performance/PerformanceCycleDetailPage").then((m) => ({
    default: m.PerformanceCycleDetailPage,
  })),
);
const KpiDefinitionsPage = lazy(() =>
  import("./pages/performance/KpiDefinitionsPage").then((m) => ({
    default: m.KpiDefinitionsPage,
  })),
);
const MyPerformancePage = lazy(() =>
  import("./pages/performance/MyPerformancePage").then((m) => ({
    default: m.MyPerformancePage,
  })),
);

// Report pages
const ExecutiveOverviewReportPage = lazy(() =>
  import("./pages/reports/ExecutiveOverviewReportPage").then((m) => ({
    default: m.ExecutiveOverviewReportPage,
  })),
);
const PerformanceReportPage = lazy(() =>
  import("./pages/reports/PerformanceReportPage").then((m) => ({
    default: m.PerformanceReportPage,
  })),
);
const ResearchPortfolioReportPage = lazy(() =>
  import("./pages/reports/ResearchPortfolioReportPage").then((m) => ({
    default: m.ResearchPortfolioReportPage,
  })),
);
const WorkforceReportPage = lazy(() =>
  import("./pages/reports/WorkforceReportPage").then((m) => ({
    default: m.WorkforceReportPage,
  })),
);

// Phase 3 pages
const ManuscriptsPage = lazy(() =>
  import("./pages/publications/ManuscriptsPage").then((m) => ({
    default: m.ManuscriptsPage,
  })),
);
const ManuscriptDetailPage = lazy(() =>
  import("./pages/publications/ManuscriptDetailPage").then((m) => ({
    default: m.ManuscriptDetailPage,
  })),
);
const BudgetsPage = lazy(() =>
  import("./pages/finance/BudgetsPage").then((m) => ({
    default: m.BudgetsPage,
  })),
);
const BudgetDetailPage = lazy(() =>
  import("./pages/finance/BudgetDetailPage").then((m) => ({
    default: m.BudgetDetailPage,
  })),
);
const QualityReviewsPage = lazy(() =>
  import("./pages/quality/QualityReviewsPage").then((m) => ({
    default: m.QualityReviewsPage,
  })),
);
const QualityReviewDetailPage = lazy(() =>
  import("./pages/quality/QualityReviewDetailPage").then((m) => ({
    default: m.QualityReviewDetailPage,
  })),
);
const DocumentsPage = lazy(() =>
  import("./pages/documents/DocumentsPage").then((m) => ({
    default: m.DocumentsPage,
  })),
);
const DocumentDetailPage = lazy(() =>
  import("./pages/documents/DocumentDetailPage").then((m) => ({
    default: m.DocumentDetailPage,
  })),
);
const PublicationsReportPage = lazy(() =>
  import("./pages/reports/PublicationsReportPage").then((m) => ({
    default: m.PublicationsReportPage,
  })),
);

// Phase 4 pages
const NotificationsPage = lazy(() =>
  import("./pages/notifications/NotificationsPage").then((m) => ({
    default: m.NotificationsPage,
  })),
);
const NotificationPreferencesPage = lazy(() =>
  import("./pages/notifications/NotificationPreferencesPage").then((m) => ({
    default: m.NotificationPreferencesPage,
  })),
);
const SubscriptionPage = lazy(() =>
  import("./pages/settings/SubscriptionPage").then((m) => ({
    default: m.SubscriptionPage,
  })),
);
const PlatformAdminPage = lazy(() =>
  import("./pages/platform/PlatformAdminPage").then((m) => ({
    default: m.PlatformAdminPage,
  })),
);
const AnalyticsDashboardPage = lazy(() =>
  import("./pages/analytics/AnalyticsDashboardPage").then((m) => ({
    default: m.AnalyticsDashboardPage,
  })),
);
const AIReportPage = lazy(() =>
  import("./pages/analytics/AIReportPage").then((m) => ({
    default: m.AIReportPage,
  })),
);

// Website CMS pages
const WebsiteOverviewPage = lazy(() =>
  import("./pages/website/WebsiteOverviewPage").then((m) => ({
    default: m.WebsiteOverviewPage,
  })),
);
const WebsiteBrandingPage = lazy(() =>
  import("./pages/website/WebsiteBrandingPage").then((m) => ({
    default: m.WebsiteBrandingPage,
  })),
);
const WebsitePagesPage = lazy(() =>
  import("./pages/website/WebsitePagesPage").then((m) => ({
    default: m.WebsitePagesPage,
  })),
);
const WebsitePageEditorPage = lazy(() =>
  import("./pages/website/WebsitePageEditorPage").then((m) => ({
    default: m.WebsitePageEditorPage,
  })),
);
const WebsiteNewsPage = lazy(() =>
  import("./pages/website/WebsiteNewsPage").then((m) => ({
    default: m.WebsiteNewsPage,
  })),
);
const WebsiteEventsPage = lazy(() =>
  import("./pages/website/WebsiteEventsPage").then((m) => ({
    default: m.WebsiteEventsPage,
  })),
);
const WebsiteOpportunitiesPage = lazy(() =>
  import("./pages/website/WebsiteOpportunitiesPage").then((m) => ({
    default: m.WebsiteOpportunitiesPage,
  })),
);
const WebsitePublicationsPage = lazy(() =>
  import("./pages/website/WebsitePublicationsPage").then((m) => ({
    default: m.WebsitePublicationsPage,
  })),
);
const WebsiteContactPage = lazy(() =>
  import("./pages/website/WebsiteContactPage").then((m) => ({
    default: m.WebsiteContactPage,
  })),
);
const WebsiteTeamPage = lazy(() =>
  import("./pages/website/WebsiteTeamPage").then((m) => ({
    default: m.WebsiteTeamPage,
  })),
);
const WebsitePartnersPage = lazy(() =>
  import("./pages/website/WebsitePartnersPage").then((m) => ({
    default: m.WebsitePartnersPage,
  })),
);
const WebsiteFaqsPage = lazy(() =>
  import("./pages/website/WebsiteFaqsPage").then((m) => ({
    default: m.WebsiteFaqsPage,
  })),
);
const WebsiteResourcesPage = lazy(() =>
  import("./pages/website/WebsiteResourcesPage").then((m) => ({
    default: m.WebsiteResourcesPage,
  })),
);
const WebsiteDomainsPage = lazy(() =>
  import("./pages/website/WebsiteDomainsPage").then((m) => ({
    default: m.WebsiteDomainsPage,
  })),
);

export const router = createBrowserRouter([
  { path: "/login", element: wrap(LoginPage) },
  { path: "/forgot-password", element: wrap(ForgotPasswordPage) },
  { path: "/reset-password/:token", element: wrap(ResetPasswordPage) },
  { path: "/accept-invitation/:token", element: wrap(AcceptInvitationPage) },
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  {
    element: (
      <PrivateRoute>
        <AppShell />
      </PrivateRoute>
    ),
    children: [
      { path: "/dashboard", element: wrap(DashboardPage) },
      { path: "/users", element: wrap(UsersPage) },
      { path: "/users/:id", element: wrap(UserDetailPage) },
      { path: "/roles", element: wrap(RolesPage) },
      { path: "/roles/:id", element: wrap(RoleDetailPage) },
      { path: "/institution", element: wrap(InstitutionPage) },
      { path: "/departments", element: wrap(DepartmentsPage) },
      { path: "/departments/:id", element: wrap(DepartmentDetailPage) },
      { path: "/teams", element: wrap(TeamsPage) },
      { path: "/employees", element: wrap(EmployeesPage) },
      { path: "/employees/:id", element: wrap(EmployeeDetailPage) },
      { path: "/audit", element: wrap(AuditPage) },
      // Research
      { path: "/research/projects", element: wrap(ResearchProjectsPage) },
      {
        path: "/research/projects/:id",
        element: wrap(ResearchProjectDetailPage),
      },
      // Tasks
      { path: "/tasks", element: wrap(TasksPage) },
      { path: "/tasks/:id", element: wrap(TaskDetailPage) },
      // Performance
      { path: "/performance/cycles", element: wrap(PerformanceCyclesPage) },
      {
        path: "/performance/cycles/:id",
        element: wrap(PerformanceCycleDetailPage),
      },
      { path: "/performance/kpis", element: wrap(KpiDefinitionsPage) },
      { path: "/performance/my", element: wrap(MyPerformancePage) },
      // Reports
      {
        path: "/reports/executive-overview",
        element: wrap(ExecutiveOverviewReportPage),
      },
      { path: "/reports/performance", element: wrap(PerformanceReportPage) },
      { path: "/reports/research", element: wrap(ResearchPortfolioReportPage) },
      { path: "/reports/workforce", element: wrap(WorkforceReportPage) },
      // Publications
      { path: "/publications", element: wrap(ManuscriptsPage) },
      { path: "/publications/:id", element: wrap(ManuscriptDetailPage) },
      // Finance
      { path: "/finance/budgets", element: wrap(BudgetsPage) },
      { path: "/finance/budgets/:id", element: wrap(BudgetDetailPage) },
      // Quality
      { path: "/quality/reviews", element: wrap(QualityReviewsPage) },
      { path: "/quality/reviews/:id", element: wrap(QualityReviewDetailPage) },
      // Documents
      { path: "/documents", element: wrap(DocumentsPage) },
      { path: "/documents/:id", element: wrap(DocumentDetailPage) },
      // Reports (Phase 3)
      { path: "/reports/publications", element: wrap(PublicationsReportPage) },
      // Phase 4
      { path: "/notifications", element: wrap(NotificationsPage) },
      {
        path: "/notifications/preferences",
        element: wrap(NotificationPreferencesPage),
      },
      { path: "/settings/subscription", element: wrap(SubscriptionPage) },
      { path: "/platform/admin", element: wrap(PlatformAdminPage) },
      { path: "/analytics", element: wrap(AnalyticsDashboardPage) },
      { path: "/analytics/ai-report", element: wrap(AIReportPage) },
      // Website CMS
      { path: "/website", element: wrap(WebsiteOverviewPage) },
      { path: "/website/branding", element: wrap(WebsiteBrandingPage) },
      { path: "/website/pages", element: wrap(WebsitePagesPage) },
      { path: "/website/pages/:id", element: wrap(WebsitePageEditorPage) },
      { path: "/website/news", element: wrap(WebsiteNewsPage) },
      { path: "/website/events", element: wrap(WebsiteEventsPage) },
      {
        path: "/website/opportunities",
        element: wrap(WebsiteOpportunitiesPage),
      },
      { path: "/website/publications", element: wrap(WebsitePublicationsPage) },
      { path: "/website/contact", element: wrap(WebsiteContactPage) },
      { path: "/website/domains", element: wrap(WebsiteDomainsPage) },
      { path: "/website/team", element: wrap(WebsiteTeamPage) },
      { path: "/website/partners", element: wrap(WebsitePartnersPage) },
      { path: "/website/faqs", element: wrap(WebsiteFaqsPage) },
      { path: "/website/resources", element: wrap(WebsiteResourcesPage) },
    ],
  },
]);
