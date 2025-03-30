import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SymptomTrackerService {

  private apiUrl = `${environment.apiURL}/submit_symptoms`;

  constructor(private http: HttpClient) {}

  submitSymptoms(requestBody: any): Observable<any> {
    console.log("Sending symptoms data:", requestBody);
    return this.http.post<any>(this.apiUrl, requestBody);
  }
}
