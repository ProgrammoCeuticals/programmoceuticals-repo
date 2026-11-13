import { useState, useRef, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  LayoutDashboard,
  Users,
  Building2,
  Network,
  Users2,
  UserCheck,
  ClipboardList,
  Menu,
  X,
  FlaskConical,
  CheckSquare,
  BarChart2,
  TrendingUp,
  BookOpen,
  Banknote,
  ShieldCheck,
  FolderOpen,
  Bell,
  LineChart,
  Settings,
  Shield,
  Globe,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth.store";
import api from "../lib/api";

// ── Nav structure ──────────────────────────────────────────────────────────

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  permission: string | null;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        path: "/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        permission: null,
      },
    ],
  },
  {
    label: "Organisation",
    items: [
      {
        path: "/institution",
        label: "Institution",
        icon: Building2,
        permission: "institution.view",
      },
      {
        path: "/departments",
        label: "Departments",
        icon: Network,
        permission: "departments.view",
      },
      {
        path: "/teams",
        label: "Teams",
        icon: Users2,
        permission: "teams.view",
      },
      {
        path: "/employees",
        label: "Employees",
        icon: UserCheck,
        permission: "employees.view",
      },
      {
        path: "/users",
        label: "Users & Roles",
        icon: Users,
        permission: "users.view",
      },
    ],
  },
  {
    label: "Research",
    items: [
      {
        path: "/research/projects",
        label: "Projects",
        icon: FlaskConical,
        permission: "research.projects.view",
      },
      {
        path: "/tasks",
        label: "Tasks",
        icon: CheckSquare,
        permission: "tasks.view",
      },
      {
        path: "/publications",
        label: "Publications",
        icon: BookOpen,
        permission: "publications.view",
      },
      {
        path: "/quality/reviews",
        label: "Quality",
        icon: ShieldCheck,
        permission: "quality.reviews.view",
      },
      {
        path: "/documents",
        label: "Documents",
        icon: FolderOpen,
        permission: "documents.view",
      },
    ],
  },
  {
    label: "People & Finance",
    items: [
      {
        path: "/performance/cycles",
        label: "Performance",
        icon: TrendingUp,
        permission: "performance.cycles.view",
      },
      {
        path: "/finance/budgets",
        label: "Finance",
        icon: Banknote,
        permission: "finance.view",
      },
    ],
  },
  {
    label: "Insights",
    items: [
      {
        path: "/reports/executive-overview",
        label: "Reports",
        icon: BarChart2,
        permission: "reports.view",
      },
      {
        path: "/analytics",
        label: "Analytics",
        icon: LineChart,
        permission: "reports.view",
      },
      {
        path: "/audit",
        label: "Audit Log",
        icon: ClipboardList,
        permission: "audit.view",
      },
    ],
  },
  {
    label: "Platform",
    items: [
      {
        path: "/website",
        label: "Website",
        icon: Globe,
        permission: "website.view",
      },
      {
        path: "/notifications",
        label: "Notifications",
        icon: Bell,
        permission: null,
      },
      {
        path: "/settings/subscription",
        label: "Subscription",
        icon: Settings,
        permission: "institution.settings.manage",
      },
      {
        path: "/platform/admin",
        label: "Platform Admin",
        icon: Shield,
        permission: "__platform_admin__",
      },
    ],
  },
];

const ALL_NAV_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

function getInitials(firstName?: string, lastName?: string): string {
  return ((firstName?.[0] ?? "") + (lastName?.[0] ?? "")).toUpperCase() || "?";
}

function getPageName(pathname: string): string {
  const item = ALL_NAV_ITEMS.find(
    (n) => pathname === n.path || pathname.startsWith(n.path + "/"),
  );
  if (item) return item.label;
  if (pathname.startsWith("/performance")) return "Performance";
  if (pathname.startsWith("/reports")) return "Reports";
  if (pathname.startsWith("/finance")) return "Finance";
  if (pathname.startsWith("/quality")) return "Quality";
  return "RIMS";
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

interface NotifItem {
  id: string;
  title: string;
  body: string | null;
  actionUrl: string | null;
  createdAt: string;
}

// ── Notification Bell ──────────────────────────────────────────────────────

function NotificationBell() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: countData } = useQuery({
    queryKey: ["notifications-unread-count"],
    queryFn: () =>
      api
        .get<{ data: { count: number } }>("/notifications/unread-count")
        .then((r) => r.data),
    refetchInterval: 30000,
  });

  const count = countData?.data?.count ?? 0;
  const displayCount = count > 99 ? "99+" : count > 0 ? String(count) : null;

  const { data: notifData, isLoading: notifLoading } = useQuery({
    queryKey: ["notifications-dropdown"],
    queryFn: () =>
      api
        .get<{
          data: NotifItem[];
        }>("/notifications", { params: { status: "UNREAD", pageSize: 5 } })
        .then((r) => r.data),
    enabled: open,
  });

  const notifications: NotifItem[] = notifData?.data ?? [];

  const markAllReadMutation = useMutation({
    mutationFn: () => api.post("/notifications/read-all").then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications-unread-count"],
      });
      queryClient.invalidateQueries({ queryKey: ["notifications-dropdown"] });
    },
  });

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button — GLSI-style: sharp border, no radius */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 border border-transparent hover:border-[#e2e8f0] hover:bg-[#f7f8fa] transition-colors"
        aria-label="Notifications"
      >
        <Bell size={16} className="text-[#193441]" />
        {displayCount && (
          /* Badge — sharp rectangle, no pill */
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-[#c53030] text-white text-[9px] font-bold flex items-center justify-center px-1 leading-none">
            {displayCount}
          </span>
        )}
      </button>

      {open && (
        /* Dropdown — no radius, GLSI-style border */
        <div className="absolute right-0 top-full mt-1 w-80 bg-white border border-[#e2e8f0] shadow-dropdown z-50 overflow-hidden">
          {/* Header strip — dark brand fill, like GLSI detail panel header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#193441]">
            <span className="text-xs font-bold text-white uppercase tracking-[0.06em]">
              Notifications
            </span>
            <button
              onClick={() => markAllReadMutation.mutate()}
              disabled={markAllReadMutation.isPending || count === 0}
              className="text-[11px] text-[#c17f24] hover:underline disabled:opacity-40"
            >
              Mark all read
            </button>
          </div>

          <div className="divide-y divide-[#e2e8f0] max-h-72 overflow-y-auto scrollbar-thin">
            {notifLoading ? (
              <div className="px-4 py-8 text-center text-sm text-[#718096]">
                Loading…
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-[#718096]">
                No unread notifications
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  className="w-full text-left px-4 py-3 hover:bg-[#f7f8fa] transition-colors"
                  onClick={() => {
                    setOpen(false);
                    if (n.actionUrl) navigate(n.actionUrl);
                  }}
                >
                  <p className="text-sm font-semibold text-[#193441] truncate">
                    {n.title}
                  </p>
                  {n.body && (
                    <p className="text-xs text-[#718096] mt-0.5 line-clamp-2">
                      {n.body.slice(0, 80)}
                      {n.body.length > 80 ? "…" : ""}
                    </p>
                  )}
                  <p className="text-xs text-[#718096] mt-1">
                    {relativeTime(n.createdAt)}
                  </p>
                </button>
              ))
            )}
          </div>

          <div className="border-t border-[#e2e8f0] px-4 py-2.5 bg-[#f7f8fa]">
            <button
              onClick={() => {
                setOpen(false);
                navigate("/notifications");
              }}
              className="text-xs text-[#193441] hover:underline font-semibold w-full text-center"
            >
              View all notifications →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────────────

interface SidebarProps {
  onClose?: () => void;
}

function SidebarContent({ onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  function handleNav(path: string) {
    navigate(path);
    onClose?.();
  }

  async function handleLogout() {
    try {
      await api.post("/auth/logout");
    } catch {
      /* ignore */
    }
    clearAuth();
    navigate("/login");
  }

  function isItemVisible(item: NavItem): boolean {
    if (item.permission === null) return true;
    if (item.permission === "__platform_admin__") {
      return (
        hasPermission("roles.create") &&
        hasPermission("finance.approve") &&
        hasPermission("audit.view")
      );
    }
    return hasPermission(item.permission);
  }

  const initials = getInitials(user?.firstName, user?.lastName);

  return (
    <div className="flex flex-col h-full">
      {/* ── Logo strip — GLSI nav-brand pattern ── */}
      <div className="flex-shrink-0 bg-[#122830] border-b border-white/10">
        <div className="px-5 py-4 flex items-center gap-3">
          {/* R mark — sharp square outline, like GLSI's instrument mark */}
          <div className="w-8 h-8 border border-[#c17f24] flex items-center justify-center flex-shrink-0">
            <span className="text-[#c17f24] text-sm font-black leading-none">
              R
            </span>
          </div>
          <div>
            {/* Nav title — GLSI nav-title style: uppercase, border-left separator */}
            <p className="text-white text-sm font-bold uppercase tracking-[0.08em] leading-none border-l border-white/30 pl-2.5">
              RIMS
            </p>
            <p className="text-white/40 text-[9px] mt-0.5 uppercase tracking-[0.05em] pl-2.5">
              ProgrammoCeuticals
            </p>
          </div>
        </div>
      </div>

      {/* ── Nav groups ── */}
      <nav
        className="flex-1 overflow-y-auto scrollbar-thin px-3 pb-3 pt-3 space-y-4"
        aria-label="Main navigation"
      >
        {NAV_GROUPS.map((group) => {
          const visibleItems = group.items.filter(isItemVisible);
          if (visibleItems.length === 0) return null;
          return (
            <div key={group.label}>
              {/* Group label — GLSI .section-title style in sidebar context */}
              <p className="px-2 mb-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">
                {group.label}
              </p>
              {/* Thin ruled separator under group label */}
              <div className="border-b border-white/10 mb-1.5" />
              <div className="space-y-px">
                {visibleItems.map((item) => {
                  const isActive =
                    location.pathname === item.path ||
                    location.pathname.startsWith(item.path + "/");
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNav(item.path)}
                      className={`w-full flex items-center gap-3 px-2 py-2 text-[13px] transition-colors duration-100 relative ${
                        isActive
                          ? "bg-white/10 text-white font-semibold"
                          : "text-white/60 hover:bg-white/5 hover:text-white/90 font-normal"
                      }`}
                    >
                      {/* Active left border indicator — GLSI's left-border active pattern */}
                      {isActive && (
                        <span
                          className="absolute left-0 top-0 w-[3px] h-full bg-[#c17f24]"
                          aria-hidden="true"
                        />
                      )}
                      <Icon
                        size={14}
                        aria-hidden="true"
                        className="flex-shrink-0 ml-0.5"
                      />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* ── User section — GLSI app-footer style: dark strip at bottom ── */}
      <div className="flex-shrink-0 bg-[#122830] border-t border-white/10">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group">
              {/* Sharp square avatar — no circle */}
              <div className="w-7 h-7 bg-[#193441] border border-[#c17f24] flex items-center justify-center flex-shrink-0">
                <span className="text-[#c17f24] text-[10px] font-bold">
                  {initials}
                </span>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-semibold text-white/90 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[9px] text-white/40 truncate">
                  {user?.email}
                </p>
              </div>
              <ChevronDown
                size={11}
                className="text-white/30 flex-shrink-0 group-hover:text-white/50"
              />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              side="top"
              align="start"
              sideOffset={8}
              /* Dropdown — no radius, GLSI border style */
              className="z-50 min-w-[200px] bg-white border border-[#e2e8f0] shadow-dropdown py-1 text-sm"
            >
              <div className="px-3 py-2 border-b border-[#e2e8f0] mb-1 bg-[#f7f8fa]">
                <p className="text-[11px] font-bold text-[#193441] uppercase tracking-[0.05em]">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[10px] text-[#718096] truncate">
                  {user?.email}
                </p>
              </div>
              <DropdownMenu.Item
                onSelect={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-[#c53030] text-[13px] cursor-pointer select-none outline-none hover:bg-[#fff5f5] transition-colors"
              >
                <LogOut size={12} />
                Sign out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  );
}

// ── AppShell ───────────────────────────────────────────────────────────────

export function AppShell() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageName = getPageName(location.pathname);

  const { data: instData } = useQuery({
    queryKey: ["institution-name"],
    queryFn: () =>
      api.get<{ data: { name: string } }>("/institution").then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });
  const institutionName = instData?.data?.name ?? "RIMS";

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* ── Fixed Sidebar (desktop) — GLSI brand bg ── */}
      <aside className="fixed left-0 top-0 h-screen w-56 bg-[#193441] z-30 hidden md:flex flex-col">
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative w-56 h-full bg-[#193441] flex flex-col">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white p-1 hover:bg-white/10 transition-colors"
              aria-label="Close navigation"
            >
              <X size={16} />
            </button>
            <SidebarContent onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* ── Fixed Topbar ── */}
      {/* Top 2px accent bar + 1px bottom border — GLSI nav pattern */}
      <header
        className="fixed top-0 left-0 md:left-56 right-0 h-[50px] bg-white border-b border-[#e2e8f0] z-20 flex items-center justify-between px-4 md:px-6"
        style={{ borderTop: "2px solid #193441" }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 text-[#193441] hover:bg-[#f7f8fa] transition-colors"
            aria-label="Open navigation"
          >
            <Menu size={16} />
          </button>
          {/* Breadcrumb — GLSI nav-title style */}
          <div className="flex items-center gap-2 text-[12px]">
            <span className="hidden sm:block text-[#718096] font-semibold uppercase tracking-[0.04em]">
              {institutionName}
            </span>
            <span className="hidden sm:block text-[#c5d8e3]">/</span>
            <span className="font-bold text-[#193441] uppercase tracking-[0.04em]">
              {pageName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <NotificationBell />
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="ml-0 md:ml-56 pt-[50px] min-h-screen bg-[#f7f8fa]">
        <div className="p-6 h-full">
          <Outlet />
        </div>
      </main>

      {/* ── Footer strip — GLSI app-footer pattern ── */}
      <footer className="ml-0 md:ml-56 bg-[#193441] py-2 px-6 text-center">
        <p className="text-[10px] text-white/40 uppercase tracking-[0.08em]">
          RIMS · {institutionName} · A ProgrammoCeuticals Product
        </p>
      </footer>
    </div>
  );
}
