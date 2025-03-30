import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyzeTrendsService {

  constructor(private http: HttpClient) { }

  analyzeTrends(userId: string): Observable<any> {
    const apiUrl = `${environment.apiURL}/analyze_trends`;
    const requestBody = { username: userId };
    return this.http.post<any>(apiUrl, requestBody);
  }
}
