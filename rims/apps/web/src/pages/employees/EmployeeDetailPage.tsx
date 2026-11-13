import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PageHeader, Button, Badge, Spinner, EmptyState,
  Modal, FormField, Input, Select,
} from "@rims/ui";
import { toast } from "@rims/ui";
import api from "../../lib/api";
import { useAuthStore } from "../../store/auth.store";

// ── Types ──────────────────────────────────────────────────────────────────

interface Qualification { id: string; name: string; institution: string | null; yearObtained: number | null; }
interface Skill { id: string; skill: string; level: string | null; }
interface EmploymentRecord { id: string; eventType: string; description: string | null; effectiveDate: string; }
interface Employee {
  id: string; firstName: string; lastName: string; status: string;
  hireDate: string | null; reportingManagerId: string | null;
  department: { id: string; name: string } | null;
  team: { id: string; name: string } | null;
  position: { id: string; title: string } | null;
  qualifications: Qualification[];
  skills: Skill[];
  employmentRecords: EmploymentRecord[];
}

type Tab = "overview" | "qualifications" | "skills" | "history";

function fmt(d: string | null | undefined) {
  return d ? new Date(d).toLocaleDateString() : "—";
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718096] mb-1">{label}</p>
      <div className="text-[13px] font-semibold text-[#193441]">{children}</div>
    </div>
  );
}

// ── EditEmployeeModal ──────────────────────────────────────────────────────

function EditEmployeeModal({ open, onClose, employee }: { open: boolean; onClose: () => void; employee: Employee }) {
  const queryClient = useQueryClient();
  const [firstName, setFirstName] = useState(employee.firstName);
  const [lastName, setLastName] = useState(employee.lastName);
  const [status, setStatus] = useState(employee.status);
  const [hireDate, setHireDate] = useState(employee.hireDate?.slice(0, 10) ?? "");

  const mutation = useMutation({
    mutationFn: () =>
      api.patch(`/employees/${employee.id}`, {
        firstName, lastName, status,
        hireDate: hireDate || undefined,
      }).then((r) => r.data),
    onSuccess: () => {
      toast({ title: "Employee updated", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["employee", employee.id] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      onClose();
    },
    onError: (err: Error) => toast({ title: "Failed to update", description: err.message, variant: "error" }),
  });

  return (
    <Modal open={open} onClose={onClose} title="Edit Employee"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={mutation.isPending}>Cancel</Button>
          <Button variant="primary" onClick={() => mutation.mutate()} loading={mutation.isPending}>Save</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="First Name" htmlFor="edit-first" required>
            <Input id="edit-first" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </FormField>
          <FormField label="Last Name" htmlFor="edit-last" required>
            <Input id="edit-last" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </FormField>
        </div>
        <FormField label="Status" htmlFor="edit-status">
          <Select id="edit-status" value={status} onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: "ACTIVE", label: "Active" },
              { value: "ON_LEAVE", label: "On Leave" },
              { value: "SUSPENDED", label: "Suspended" },
              { value: "TERMINATED", label: "Terminated" },
              { value: "ARCHIVED", label: "Archived" },
            ]}
          />
        </FormField>
        <FormField label="Hire Date" htmlFor="edit-hire">
          <Input id="edit-hire" type="date" value={hireDate} onChange={(e) => setHireDate(e.target.value)} />
        </FormField>
      </div>
    </Modal>
  );
}

// ── AddQualificationModal ──────────────────────────────────────────────────

function AddQualificationModal({ open, onClose, employeeId }: { open: boolean; onClose: () => void; employeeId: string }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [yearObtained, setYearObtained] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      api.post(`/employees/${employeeId}/qualifications`, {
        name, institution: institution || undefined,
        yearObtained: yearObtained ? Number(yearObtained) : undefined,
      }).then((r) => r.data),
    onSuccess: () => {
      toast({ title: "Qualification added", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
      setName(""); setInstitution(""); setYearObtained("");
      onClose();
    },
    onError: (err: Error) => toast({ title: "Failed to add", description: err.message, variant: "error" }),
  });

  return (
    <Modal open={open} onClose={onClose} title="Add Qualification"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={mutation.isPending}>Cancel</Button>
          <Button variant="primary" onClick={() => mutation.mutate()} loading={mutation.isPending} disabled={!name.trim()}>Add</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <FormField label="Qualification Name" htmlFor="qual-name" required>
          <Input id="qual-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. B.Pharm" />
        </FormField>
        <FormField label="Institution" htmlFor="qual-inst">
          <Input id="qual-inst" value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="e.g. University of Lagos" />
        </FormField>
        <FormField label="Year Obtained" htmlFor="qual-year">
          <Input id="qual-year" type="number" value={yearObtained} onChange={(e) => setYearObtained(e.target.value)} placeholder="e.g. 2018" />
        </FormField>
      </div>
    </Modal>
  );
}

// ── AddSkillModal ──────────────────────────────────────────────────────────

function AddSkillModal({ open, onClose, employeeId }: { open: boolean; onClose: () => void; employeeId: string }) {
  const queryClient = useQueryClient();
  const [skill, setSkill] = useState("");
  const [level, setLevel] = useState("INTERMEDIATE");

  const mutation = useMutation({
    mutationFn: () =>
      api.post(`/employees/${employeeId}/skills`, { skill, level }).then((r) => r.data),
    onSuccess: () => {
      toast({ title: "Skill added", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
      setSkill(""); setLevel("INTERMEDIATE");
      onClose();
    },
    onError: (err: Error) => toast({ title: "Failed to add", description: err.message, variant: "error" }),
  });

  return (
    <Modal open={open} onClose={onClose} title="Add Skill"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={mutation.isPending}>Cancel</Button>
          <Button variant="primary" onClick={() => mutation.mutate()} loading={mutation.isPending} disabled={!skill.trim()}>Add</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <FormField label="Skill" htmlFor="skill-name" required>
          <Input id="skill-name" value={skill} onChange={(e) => setSkill(e.target.value)} placeholder="e.g. Clinical Trials" />
        </FormField>
        <FormField label="Level" htmlFor="skill-level">
          <Select id="skill-level" value={level} onChange={(e) => setLevel(e.target.value)}
            options={[
              { value: "BEGINNER", label: "Beginner" },
              { value: "INTERMEDIATE", label: "Intermediate" },
              { value: "ADVANCED", label: "Advanced" },
              { value: "EXPERT", label: "Expert" },
            ]}
          />
        </FormField>
      </div>
    </Modal>
  );
}

// ── EmployeeDetailPage ─────────────────────────────────────────────────────

export function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [editOpen, setEditOpen] = useState(false);
  const [addQualOpen, setAddQualOpen] = useState(false);
  const [addSkillOpen, setAddSkillOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["employee", id],
    queryFn: () => api.get(`/employees/${id}`).then((r) => r.data),
    enabled: !!id,
  });

  const employee: Employee | undefined = (data as { data?: Employee } | undefined)?.data;

  if (isLoading) return <div className="flex items-center justify-center py-20"><Spinner size="lg" /></div>;
  if (!employee) return (
    <EmptyState title="Employee not found" description="This employee does not exist."
      action={<Button onClick={() => navigate("/employees")}>Back to Employees</Button>}
    />
  );

  const fullName = `${employee.firstName} ${employee.lastName}`;
  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "qualifications", label: "Qualifications" },
    { key: "skills", label: "Skills" },
    { key: "history", label: "Employment History" },
  ];

  return (
    <div>
      <PageHeader
        title={fullName}
        breadcrumbs={[{ label: "Employees", href: "/employees" }, { label: fullName }]}
        actions={
          <div className="flex gap-2">
            {hasPermission("employees.write") && (
              <Button onClick={() => setEditOpen(true)}>Edit</Button>
            )}
            <Button variant="ghost" onClick={() => navigate("/employees")}>← Back</Button>
          </div>
        }
      />

      {/* Status bar */}
      <div className="bg-white border border-[#e2e8f0] px-6 py-3 mb-1 flex flex-wrap items-center gap-4">
        <Badge label={employee.status} />
        {employee.department && <span className="text-[11px] text-[#718096]">Dept: <span className="font-semibold text-[#193441]">{employee.department.name}</span></span>}
        {employee.position && <span className="text-[11px] text-[#718096]">Position: <span className="font-semibold text-[#193441]">{employee.position.title}</span></span>}
        {employee.team && <span className="text-[11px] text-[#718096]">Team: <span className="font-semibold text-[#193441]">{employee.team.name}</span></span>}
        <span className="text-[11px] text-[#718096]">Hired: <span className="font-semibold text-[#193441]">{fmt(employee.hireDate)}</span></span>
      </div>

      {/* Tabs */}
      <div className="border-b-2 border-[#e2e8f0] mb-5">
        <div className="flex">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 border-b-[3px] transition-colors text-[11px] uppercase tracking-[0.06em] font-bold ${activeTab === tab.key ? "text-[#193441] border-[#193441]" : "text-[#718096] border-transparent hover:text-[#193441]"}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Overview ── */}
      {activeTab === "overview" && (
        <div className="bg-white border border-[#e2e8f0] p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <InfoRow label="Full Name">{fullName}</InfoRow>
            <InfoRow label="Status"><Badge label={employee.status} /></InfoRow>
            <InfoRow label="Department">{employee.department?.name ?? "—"}</InfoRow>
            <InfoRow label="Position">{employee.position?.title ?? "—"}</InfoRow>
            <InfoRow label="Team">{employee.team?.name ?? "—"}</InfoRow>
            <InfoRow label="Hire Date">{fmt(employee.hireDate)}</InfoRow>
          </div>
        </div>
      )}

      {/* ── Qualifications ── */}
      {activeTab === "qualifications" && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#193441]">Qualifications ({employee.qualifications.length})</p>
            {hasPermission("employees.write") && (
              <Button size="sm" onClick={() => setAddQualOpen(true)}>Add Qualification</Button>
            )}
          </div>
          <div className="bg-white border border-[#e2e8f0] divide-y divide-slate-100">
            {employee.qualifications.length === 0
              ? <p className="px-4 py-8 text-sm text-slate-500 text-center">No qualifications recorded.</p>
              : employee.qualifications.map((q) => (
                <div key={q.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-semibold text-[#193441]">{q.name}</p>
                    {q.institution && <p className="text-[11px] text-[#718096]">{q.institution}</p>}
                  </div>
                  {q.yearObtained && <span className="text-[11px] font-mono text-[#718096]">{q.yearObtained}</span>}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ── Skills ── */}
      {activeTab === "skills" && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#193441]">Skills ({employee.skills.length})</p>
            {hasPermission("employees.write") && (
              <Button size="sm" onClick={() => setAddSkillOpen(true)}>Add Skill</Button>
            )}
          </div>
          <div className="bg-white border border-[#e2e8f0] divide-y divide-slate-100">
            {employee.skills.length === 0
              ? <p className="px-4 py-8 text-sm text-slate-500 text-center">No skills recorded.</p>
              : employee.skills.map((s) => (
                <div key={s.id} className="flex items-center justify-between px-5 py-3">
                  <p className="text-sm text-[#193441]">{s.skill}</p>
                  {s.level && <Badge label={s.level} />}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ── Employment History ── */}
      {activeTab === "history" && (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#193441] mb-3">Employment History ({employee.employmentRecords.length})</p>
          <div className="bg-white border border-[#e2e8f0] divide-y divide-slate-100">
            {employee.employmentRecords.length === 0
              ? <p className="px-4 py-8 text-sm text-slate-500 text-center">No employment records yet.</p>
              : [...employee.employmentRecords]
                  .sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime())
                  .map((r) => (
                    <div key={r.id} className="flex items-start justify-between px-5 py-3">
                      <div>
                        <p className="text-sm font-semibold text-[#193441]">{r.eventType.replace(/_/g, " ")}</p>
                        {r.description && <p className="text-[11px] text-[#718096] mt-0.5">{r.description}</p>}
                      </div>
                      <span className="text-[11px] text-[#718096] whitespace-nowrap ml-4">{fmt(r.effectiveDate)}</span>
                    </div>
                  ))}
          </div>
        </div>
      )}

      <EditEmployeeModal open={editOpen} onClose={() => setEditOpen(false)} employee={employee} />
      <AddQualificationModal open={addQualOpen} onClose={() => setAddQualOpen(false)} employeeId={id!} />
      <AddSkillModal open={addSkillOpen} onClose={() => setAddSkillOpen(false)} employeeId={id!} />
    </div>
  );
}
