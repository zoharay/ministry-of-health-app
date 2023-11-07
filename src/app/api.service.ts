import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const API_URL = 'https://datadashboard.health.gov.il/api/checkup/nursing';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  public get(): Observable<any> {
    return this.http.get(API_URL).pipe(map((res) => res));
  }
}
// /api/users
