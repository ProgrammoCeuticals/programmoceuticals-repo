import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private base = `${environment.apiUrl}/analytics`;
  constructor(private http: HttpClient) {}

  getPopulationHealth()    { return this.http.get<any>(`${this.base}/population-health`); }
  getHighRisk()            { return this.http.get<any>(`${this.base}/high-risk`); }
  getConditionPrevalence() { return this.http.get<any>(`${this.base}/condition-prevalence`); }
  getEncounterVolume()     { return this.http.get<any>(`${this.base}/encounter-volume`); }
  getRegistrationTrend()   { return this.http.get<any>(`${this.base}/registration-trend`); }
  getPolypharmacy()        { return this.http.get<any>(`${this.base}/polypharmacy`); }
  getFollowUpCompliance()  { return this.http.get<any>(`${this.base}/followup-compliance`); }
  getObservationTrends(patientId: string, type?: string) {
    const params = type ? `?type=${type}` : '';
    return this.http.get<any>(`${this.base}/observation-trends/${patientId}${params}`);
  }
}
