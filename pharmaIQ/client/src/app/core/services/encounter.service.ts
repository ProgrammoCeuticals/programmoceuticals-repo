import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EncounterService {
  private base = `${environment.apiUrl}/encounters`;
  constructor(private http: HttpClient) {}

  getOne(id: string) { return this.http.get<any>(`${this.base}/${id}`); }
  update(id: string, data: any) { return this.http.put<any>(`${this.base}/${id}`, data); }
  amend(id: string, data: any) { return this.http.post<any>(`${this.base}/${id}/amend`, data); }
  addObservation(encounterId: string, data: any) { return this.http.post<any>(`${this.base}/${encounterId}/observations`, data); }
  addAssessment(encounterId: string, data: any) { return this.http.post<any>(`${this.base}/${encounterId}/assessments`, data); }
  addCarePlan(encounterId: string, data: any) { return this.http.post<any>(`${this.base}/${encounterId}/care-plans`, data); }
  addIntervention(encounterId: string, data: any) { return this.http.post<any>(`${this.base}/${encounterId}/interventions`, data); }
}
