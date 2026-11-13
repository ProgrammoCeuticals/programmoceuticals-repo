import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private base = `${environment.apiUrl}/users`;
  constructor(private http: HttpClient) {}

  getAll()                   { return this.http.get<any>(this.base); }
  create(data: any)          { return this.http.post<any>(this.base, data); }
  update(id: string, data: any) { return this.http.patch<any>(`${this.base}/${id}`, data); }
  deactivate(id: string)     { return this.http.delete<any>(`${this.base}/${id}`); }
}
