import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import type { DashboardSummary, Division, Mail, TimelineItem, User } from "./models";

const API = (window as any).__ENV__?.API_URL || "https://drr-server.vercel.app/api";

@Injectable({ providedIn: "root" })
export class ApiService {
  constructor(private http: HttpClient) {}

  // Dashboard
  getSummary() {
    return this.http.get<DashboardSummary>(`${API}/dashboard/summary`);
  }

  // Mails
  getMails(params: Record<string, string> = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.http.get<Mail[]>(`${API}/mails${qs ? "?" + qs : ""}`);
  }

  getMail(id: string) {
    return this.http.get<Mail>(`${API}/mails/${id}`);
  }

  updateMail(id: string, body: Partial<{ code: string; companyApplicant: string; subject: string }>) {
    return this.http.patch<Mail>(`${API}/mails/${id}`, body);
  }

  createMail(body: { code: string; companyApplicant: string; subject: string }) {
    return this.http.post<Mail>(`${API}/mails`, body);
  }

  getTimeline(mailId: string) {
    return this.http.get<TimelineItem[]>(`${API}/mails/${mailId}/timeline`);
  }

  submitWorkflow(mailId: string, path: string, body: Record<string, string>) {
    return this.http.patch<Mail>(`${API}/mails/${mailId}/${path}`, body);
  }

  // Divisions
  getDivisions() {
    return this.http.get<Division[]>(`${API}/divisions`);
  }

  createDivision(body: { name: string; code: string }) {
    return this.http.post<Division>(`${API}/divisions`, body);
  }

  updateDivision(id: string, body: { name: string; code: string }) {
    return this.http.patch<Division>(`${API}/divisions/${id}`, body);
  }

  deleteDivision(id: string) {
    return this.http.delete(`${API}/divisions/${id}`);
  }

  // Users
  getUsers() {
    return this.http.get<User[]>(`${API}/users`);
  }

  createUser(body: { name: string; email: string; password: string; role: string; divisionId: string }) {
    return this.http.post<User>(`${API}/users`, body);
  }

  updateUser(id: string, body: Partial<{ name: string; email: string; password: string; role: string; divisionId: string }>) {
    return this.http.patch<User>(`${API}/users/${id}`, body);
  }

  deleteUser(id: string) {
    return this.http.delete(`${API}/users/${id}`);
  }
}
