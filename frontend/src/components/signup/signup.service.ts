import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private http: HttpClient) { }
  signup(username: string, password: string, email: string) {
    const body = {
      username: username,
      password: password,
      email: email
    };
    return this.http.post<any>(`${environment.apiURL}/signup`, body);
  }
}
