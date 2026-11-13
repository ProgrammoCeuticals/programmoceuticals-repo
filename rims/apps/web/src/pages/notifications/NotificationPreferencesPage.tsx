import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button, Spinner } from "@rims/ui";
import { toast } from "@rims/ui";
import api from "../../lib/api";

interface NotificationPreference {
  id: string;
  eventType: string;
  inAppEnabled: boolean;
  emailEnabled: boolean;
}

interface PreferencesResponse {
  data: NotificationPreference[];
}

const EVENT_TYPES: { key: string; label: string }[] = [
  { key: "task-assigned", label: "Task Assigned" },
  { key: "task-overdue", label: "Task Overdue" },
  { key: "project-status-change", label: "Project Status Change" },
  { key: "kpi-result-due", label: "KPI Result Due" },
  { key: "kpi-result-approved", label: "KPI Result Approved" },
  { key: "performance-cycle-started", label: "Performance Cycle Started" },
  { key: "document-approved", label: "Document Approved" },
  { key: "invitation-sent", label: "Invitation Sent" },
];

type PrefsState = Record<string, { inApp: boolean; email: boolean }>;

function buildDefaultPrefs(): PrefsState {
  return Object.fromEntries(
    EVENT_TYPES.map((et) => [et.key, { inApp: true, email: true }]),
  );
}

function mergeWithSaved(saved: NotificationPreference[]): PrefsState {
  const defaults = buildDefaultPrefs();
  for (const pref of saved) {
    defaults[pref.eventType] = {
      inApp: pref.inAppEnabled,
      email: pref.emailEnabled,
    };
  }
  return defaults;
}

export function NotificationPreferencesPage() {
  const [localPrefs, setLocalPrefs] = useState<PrefsState>(buildDefaultPrefs());

  const { data, isLoading } = useQuery({
    queryKey: ["notification-preferences"],
    queryFn: () =>
      api.get<PreferencesResponse>("/notifications/preferences").then((r) => r.data),
  });

  useEffect(() => {
    if (data?.data) {
      setLocalPrefs(mergeWithSaved(data.data));
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const promises = EVENT_TYPES.map((et) => {
        const pref = localPrefs[et.key];
        return api
          .patch("/notifications/preferences", {
            eventType: et.key,
            inAppEnabled: pref?.inApp ?? true,
            emailEnabled: pref?.email ?? true,
          })
          .then((r) => r.data);
      });
      await Promise.all(promises);
    },
    onSuccess: () => {
      toast({ title: "Preferences saved", variant: "success" });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to save preferences", description: err.message, variant: "error" });
    },
  });

  function togglePref(eventType: string, field: "inApp" | "email") {
    setLocalPrefs((prev) => ({
      ...prev,
      [eventType]: {
        ...prev[eventType],
        [field]: !prev[eventType]?.[field],
      },
    }));
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">
          Notification Preferences
        </h1>
        <Button
          variant="primary"
          onClick={() => saveMutation.mutate()}
          loading={saveMutation.isPending}
        >
          Save
        </Button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Event Type
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                In-App
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                Email
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {EVENT_TYPES.map((et) => {
              const pref = localPrefs[et.key] ?? { inApp: true, email: true };
              return (
                <tr key={et.key} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {et.label}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={pref.inApp}
                      onChange={() => togglePref(et.key, "inApp")}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      aria-label={`In-app notifications for ${et.label}`}
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={pref.email}
                      onChange={() => togglePref(et.key, "email")}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      aria-label={`Email notifications for ${et.label}`}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
