export type Role = "MAIL_ROOM" | "SECRETARY" | "DD" | "DESK_OFFICER" | "HOD_HOU" | "ADMIN";
export type MailStatus =
  | "REGISTERED"
  | "DIRECTOR_ROUTED"
  | "DISPATCHED_TO_DIVISION"
  | "ASSIGNED_TO_DESK_OFFICER"
  | "DESK_REVIEW_COMPLETED"
  | "HOD_HOU_REVIEWED"
  | "CLOSED";

export type Division = { id: string; name: string; code: string };
export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  divisionId: string | null;
  division?: Division | null;
};
export type Mail = {
  id: string;
  code: string;
  companyApplicant: string;
  subject: string;
  status: MailStatus;
  targetDivisionId: string | null;
  currentHolderId: string | null;
  createdAt: string;
  updatedAt: string;
  targetDivision?: Division | null;
  currentHolder?: User | null;
  divisionProcessing?: {
    deskOfficerId: string | null;
    hodHouId: string | null;
    divisionId: string;
    remark: string | null;
    deskOfficerName: string | null;
  } | null;
};
export type TimelineItem = {
  id: string;
  action: string;
  note: string | null;
  createdAt: string;
  performedBy: { name: string; role: Role };
};
export type DashboardSummary = {
  total: number;
  counts: Record<string, number>;
  overdueInactive: number;
  recentMails: Mail[];
};

export const ALL_STATUSES: MailStatus[] = [
  "REGISTERED",
  "DIRECTOR_ROUTED",
  "DISPATCHED_TO_DIVISION",
  "ASSIGNED_TO_DESK_OFFICER",
  "DESK_REVIEW_COMPLETED",
  "HOD_HOU_REVIEWED",
  "CLOSED"
];

export const ALL_ROLES: Role[] = ["MAIL_ROOM", "SECRETARY", "DD", "DESK_OFFICER", "HOD_HOU", "ADMIN"];

const PRETTY_OVERRIDES: Record<string, string> = {
  HOD_HOU: "HOD/HOU",
  hod_hou: "HOD/HOU"
};

export function pretty(value: string): string {
  if (PRETTY_OVERRIDES[value]) return PRETTY_OVERRIDES[value];
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function statusClass(status: MailStatus): string {
  return (
    {
      REGISTERED: "bg-slate-100 text-slate-700",
      DIRECTOR_ROUTED: "bg-blue-100 text-blue-800",
      DISPATCHED_TO_DIVISION: "bg-cyan-100 text-cyan-800",
      ASSIGNED_TO_DESK_OFFICER: "bg-amber-100 text-amber-800",
      DESK_REVIEW_COMPLETED: "bg-indigo-100 text-indigo-800",
      HOD_HOU_REVIEWED: "bg-emerald-100 text-emerald-800",
      CLOSED: "bg-zinc-200 text-zinc-800"
    }[status] ?? ""
  );
}
