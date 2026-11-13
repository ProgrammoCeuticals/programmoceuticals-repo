import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, Badge, DataTable, Spinner } from "@rims/ui";
import api from "../../lib/api";

interface ProjectTeam {
  id: string;
  name: string;
  startDate: string | null;
  endDate: string | null;
  researchProjectId: string;
  leader?: { firstName: string; lastName: string } | null;
  _count?: { tasks: number };
  researchProject?: { title: string };
}

interface TeamsResponse {
  data: ProjectTeam[];
  meta: { total: number; page: number; pageSize: number; totalPages: number };
}

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString();
}

export function TeamsPage() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["project-teams-all"],
    queryFn: () =>
      api.get<TeamsResponse>("/research/teams").then((r) => r.data),
  });

  const teams: ProjectTeam[] =
    (data as TeamsResponse | undefined)?.data ?? [];

  const columns = [
    { key: "name", header: "Team Name" },
    {
      key: "project",
      header: "Project",
      render: (row: ProjectTeam) => row.researchProject?.title ?? "—",
    },
    {
      key: "leader",
      header: "Team Leader",
      render: (row: ProjectTeam) =>
        row.leader
          ? `${row.leader.firstName} ${row.leader.lastName}`
          : "—",
    },
    {
      key: "startDate",
      header: "Start",
      render: (row: ProjectTeam) => formatDate(row.startDate),
    },
    {
      key: "endDate",
      header: "End",
      render: (row: ProjectTeam) => formatDate(row.endDate),
    },
    {
      key: "tasks",
      header: "Tasks",
      render: (row: ProjectTeam) => (
        <Badge variant="default" label={String(row._count?.tasks ?? 0)} />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Project Teams"
        description="Teams are created within research projects."
      />
      <DataTable<ProjectTeam>
        columns={columns}
        data={teams}
        isLoading={isLoading}
        getRowKey={(row) => row.id}
        onRowClick={(row) =>
          navigate(`/research/projects/${row.researchProjectId}`)
        }
      />
    </div>
  );
}
