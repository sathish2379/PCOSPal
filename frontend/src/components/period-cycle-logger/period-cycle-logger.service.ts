import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PeriodCycleLoggerService {

  constructor(private http: HttpClient) {}

  logPeriodCycle(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiURL}/log_cycle`, data);
  }
  getPeriodCycleLogs(userId: string): Observable<any> {
    const data = {
      username:  userId
    };
    return this.http.post<any>(`${environment.apiURL}/get_user_cycles`, data);
  }
}
