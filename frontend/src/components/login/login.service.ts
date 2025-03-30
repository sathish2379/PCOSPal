import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) {}
  login(username: string, password: string) {
    const body = {
      username: username,
      password: password,
    };
    return this.http.post<any>(`${environment.apiURL}/login`, body);
  }
}
