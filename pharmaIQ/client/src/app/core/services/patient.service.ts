import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private base = `${environment.apiUrl}/patients`;
  constructor(private http: HttpClient) {}

  getAll(search = '', page = 1) {
    let params = new HttpParams().set('page', page).set('limit', 20);
    if (search) params = params.set('search', search);
    return this.http.get<any>(this.base, { params });
  }
  getOne(id: string) { return this.http.get<any>(`${this.base}/${id}`); }
  create(data: any) { return this.http.post<any>(this.base, data); }
  update(id: string, data: any) { return this.http.put<any>(`${this.base}/${id}`, data); }
  archive(id: string) { return this.http.delete<any>(`${this.base}/${id}`); }

  getConditions(pid: string) { return this.http.get<any>(`${this.base}/${pid}/medical-conditions`); }
  addCondition(pid: string, data: any) { return this.http.post<any>(`${this.base}/${pid}/medical-conditions`, data); }
  updateCondition(pid: string, id: string, data: any) { return this.http.put<any>(`${this.base}/${pid}/medical-conditions/${id}`, data); }

  getAllergies(pid: string) { return this.http.get<any>(`${this.base}/${pid}/allergies`); }
  addAllergy(pid: string, data: any) { return this.http.post<any>(`${this.base}/${pid}/allergies`, data); }
  updateAllergy(pid: string, id: string, data: any) { return this.http.put<any>(`${this.base}/${pid}/allergies/${id}`, data); }
  setAllergyStatus(pid: string, allergyStatus: string) { return this.http.put<any>(`${this.base}/${pid}/allergy-status`, { allergyStatus }); }

  getFamilyHistory(pid: string) { return this.http.get<any>(`${this.base}/${pid}/family-history`); }
  addFamilyHistory(pid: string, data: any) { return this.http.post<any>(`${this.base}/${pid}/family-history`, data); }

  getSocialHistory(pid: string) { return this.http.get<any>(`${this.base}/${pid}/social-history`); }
  addSocialHistory(pid: string, data: any) { return this.http.post<any>(`${this.base}/${pid}/social-history`, data); }

  getProcedures(pid: string) { return this.http.get<any>(`${this.base}/${pid}/procedures`); }
  addProcedure(pid: string, data: any) { return this.http.post<any>(`${this.base}/${pid}/procedures`, data); }

  getHospitalisations(pid: string) { return this.http.get<any>(`${this.base}/${pid}/hospitalisations`); }
  addHospitalisation(pid: string, data: any) { return this.http.post<any>(`${this.base}/${pid}/hospitalisations`, data); }

  getMedications(pid: string) { return this.http.get<any>(`${this.base}/${pid}/medications`); }
  addMedication(pid: string, data: any) { return this.http.post<any>(`${this.base}/${pid}/medications`, data); }
  changeMedication(pid: string, id: string, data: any) { return this.http.put<any>(`${this.base}/${pid}/medications/${id}/change`, data); }
  getMedicationHistory(pid: string, id: string) { return this.http.get<any>(`${this.base}/${pid}/medications/${id}/history`); }
  getMedicationReviews(pid: string) { return this.http.get<any>(`${this.base}/${pid}/medication-reviews`); }
  addMedicationReview(pid: string, data: any) { return this.http.post<any>(`${this.base}/${pid}/medication-reviews`, data); }

  getEncounters(pid: string) { return this.http.get<any>(`${this.base}/${pid}/encounters`); }
  createEncounter(pid: string, data: any) { return this.http.post<any>(`${this.base}/${pid}/encounters`, data); }

  getFollowUps(pid: string) { return this.http.get<any>(`${this.base}/${pid}/follow-ups`); }
  createFollowUp(pid: string, data: any) { return this.http.post<any>(`${this.base}/${pid}/follow-ups`, data); }

  getObservations(pid: string) { return this.http.get<any>(`${this.base}/${pid}/observations`); }
  addObservation(pid: string, data: any) { return this.http.post<any>(`${this.base}/${pid}/observations`, data); }

  getTestOrders(pid: string) { return this.http.get<any>(`${this.base}/${pid}/test-orders`); }
  addTestOrder(pid: string, data: any) { return this.http.post<any>(`${this.base}/${pid}/test-orders`, data); }
  getTestResults(pid: string) { return this.http.get<any>(`${this.base}/${pid}/test-results`); }
  addTestResult(pid: string, data: any) { return this.http.post<any>(`${this.base}/${pid}/test-results`, data); }

  getTimeline(pid: string, from?: string, to?: string) {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return this.http.get<any>(`${this.base}/${pid}/timeline`, { params });
  }
  getSummary(pid: string) { return this.http.get<any>(`${this.base}/${pid}/summary`); }
}
