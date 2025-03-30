import { Component, OnInit } from '@angular/core';
import { PeriodCycleLoggerService } from './period-cycle-logger.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-period-cycle-logger',
  templateUrl: './period-cycle-logger.component.html',
  styleUrls: ['./period-cycle-logger.component.css']
})
export class PeriodCycleLoggerComponent implements OnInit {
  startDate: string = '';
  cycleLength: number | null = null;
  responseMessage: string = '';
  periodCycleLogs: any[] = [];
  errorMessage: string = '';
  userId: string = '';

  constructor(private periodCycleLoggerService: PeriodCycleLoggerService, private router: Router) {}
  ngOnInit(): void {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.userId = storedUsername;
    } else {
      this.errorMessage = 'User not found. Please log in.';
    }
    this.getCycleLogs();
  }

  logCycle() {
    if (!this.startDate || !this.cycleLength) {
      this.responseMessage = 'Please provide both the start date and cycle length.';
      return;
    }

    const data = {
      date_time: this.startDate,
      cycle_info: this.cycleLength,
      username:  this.userId
    };

    this.periodCycleLoggerService.logPeriodCycle(data).subscribe({
      next: (response) => {
        this.responseMessage = 'Cycle logged successfully!';
      },
      error: (error) => {
        this.responseMessage = `Error: ${error.message}`;
      }
    });
  }
  getCycleLogs(): void {
    this.periodCycleLoggerService.getPeriodCycleLogs(this.userId).subscribe({
      next: (data) => {
        console.log('Cycle logs:', data);
        this.periodCycleLogs = data.slice(0, 5); // Get the first 5 records
      },
      error: (error) => {
        console.error('Error fetching logs:', error);
        this.errorMessage = 'Failed to load period cycle logs. Please try again later.';
      }
    });
  }
  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
