"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  Settings,
  FileText,
  ClipboardList,
  ChevronLeft,
  Users,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  applicationId?: string | undefined;
  applicationName?: string | undefined;
}

const globalNav: NavItem[] = [
  { label: "Dashboard", href: "/applications", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Applications", href: "/applications", icon: <FolderOpen className="h-4 w-4" /> },
];

const systemNav: NavItem[] = [
  { label: "Admin", href: "/admin", icon: <Users className="h-4 w-4" /> },
  { label: "Settings", href: "/settings", icon: <Settings className="h-4 w-4" /> },
];

function applicationNav(id: string): NavItem[] {
  const base = `/applications/${id}`;
  return [
    { label: "Overview",    href: base,                    icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: "Submissions", href: `${base}/submissions`,   icon: <FolderOpen className="h-4 w-4" /> },
    { label: "Documents",   href: `${base}/documents`,     icon: <FileText className="h-4 w-4" /> },
    { label: "Audit",       href: `${base}/audit`,         icon: <ClipboardList className="h-4 w-4" /> },
  ];
}

function NavLink({ item, exact }: { item: NavItem; exact?: boolean }) {
  const pathname = usePathname();
  const active = exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(item.href + "/");

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
        active
          ? "bg-brand-50 font-medium text-brand-700"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
      )}
      aria-current={active ? "page" : undefined}
    >
      {item.icon}
      {item.label}
    </Link>
  );
}

export function Sidebar({ applicationId, applicationName }: SidebarProps) {
  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-y-0 left-0 z-20 flex w-60 flex-col border-r border-gray-200 bg-white pt-14"
    >
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {applicationId ? (
          <>
            <div className="mb-4">
              <Link
                href="/applications"
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                All Applications
              </Link>
              <p className="mt-2 truncate px-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Application
              </p>
              <p className="mt-0.5 truncate px-1 text-sm font-medium text-gray-800">
                {applicationName ?? applicationId}
              </p>
            </div>
            <div className="space-y-0.5">
              {applicationNav(applicationId).map((item) => (
                <NavLink
                  key={item.label}
                  item={item}
                  exact={item.href === `/applications/${applicationId}`}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="mb-2">
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Applications
              </p>
              <div className="mt-1 space-y-0.5">
                {globalNav.map((item) => (
                  <NavLink key={item.label} item={item} />
                ))}
              </div>
            </div>
            <div className="mt-4">
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                System
              </p>
              <div className="mt-1 space-y-0.5">
                {systemNav.map((item) => (
                  <NavLink key={item.label} item={item} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
