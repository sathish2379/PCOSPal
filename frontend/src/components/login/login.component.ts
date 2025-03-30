import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  message: string = '';


  constructor(private router: Router, private loginService:LoginService) {}

  onLogin() {
    if (!this.username || !this.password) {
      this.message = 'Please enter both username and password';
      return;
    }

    this.loginService.login(this.username, this.password).subscribe({
      next: (response) => {
        if (response.message === 'Login successful') {
          localStorage.setItem('username', this.username);
          console.log(response);
          this.message = 'Login successful!';
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        this.message = error.error?.message || 'Login failed. Please try again.';
      }
    });
  }
}
