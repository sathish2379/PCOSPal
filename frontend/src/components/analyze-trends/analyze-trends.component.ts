import { Component, OnInit } from '@angular/core';
import { AnalyzeTrendsService } from './analyze-trends.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-analyze-trends',
  templateUrl: './analyze-trends.component.html',
  styleUrls: ['./analyze-trends.component.css']
})
export class AnalyzeTrendsComponent implements OnInit {
  userId: string = '';
  trendAnalysisMessage: string = '';
  errorMessage: string = '';
  

  constructor(private analyzeTrendsService: AnalyzeTrendsService, private router: Router) {}
  ngOnInit(): void {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.userId = storedUsername;
    } else {
      this.errorMessage = 'User not found. Please log in.';
    }
  }

  analyzeTrends() {
    if (!this.userId) {
      this.errorMessage = 'Please enter your User ID.';
      this.trendAnalysisMessage = '';
      return;
    }

    this.analyzeTrendsService.analyzeTrends(this.userId).subscribe({
      next: (response) => {
        this.trendAnalysisMessage = response.trend_analysis;
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'An error occurred. Please try again later.';
        this.trendAnalysisMessage = '';
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
