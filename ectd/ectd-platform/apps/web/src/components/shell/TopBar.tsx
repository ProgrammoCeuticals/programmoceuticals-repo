"use client";

import { Bell, HelpCircle, LogOut, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/lib/auth/store";
import { cn } from "@/lib/cn";
import { useState } from "react";

export function TopBar() {
  const { user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4"
      style={{ paddingLeft: "calc(var(--sidebar-width) + 1rem)" }}
    >
      <span className="text-sm font-semibold text-gray-800">
        ProgrammoCeuticals eCTD
      </span>

      <div className="flex items-center gap-1">
        <button
          className="rounded p-2 text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>
        <button
          className="rounded p-2 text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          aria-label="Help"
        >
          <HelpCircle className="h-4 w-4" />
        </button>

        {/* User menu */}
        <div className="relative ml-2">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
              {user?.name?.[0]?.toUpperCase() ?? "?"}
            </span>
            <span className="hidden sm:block">{user?.name ?? "User"}</span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-1 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg"
            >
              <div className="border-b border-gray-100 px-3 py-2">
                <p className="text-xs font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email ?? ""}</p>
              </div>
              <button
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  void logout();
                }}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700",
                  "hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500",
                )}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
