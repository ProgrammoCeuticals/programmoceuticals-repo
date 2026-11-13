import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FollowUpService {
  private base = `${environment.apiUrl}/follow-ups`;
  constructor(private http: HttpClient) {}

  getQueue() { return this.http.get<any>(`${this.base}/queue`); }
  update(id: string, data: any) { return this.http.put<any>(`${this.base}/${id}`, data); }
}
