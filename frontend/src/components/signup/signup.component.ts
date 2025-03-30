import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SignupService } from './signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  email: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private sigupService:SignupService) {}

  onSignup() {
    if (!this.username || !this.password || !this.confirmPassword || !this.email) {
      this.errorMessage = 'All fields are required';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }
    this.sigupService.signup(this.username, this.password, this.email).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      }
    });
    this.router.navigate(['/login']);
  }
}
