import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent {
  data: any;

  constructor(public router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.data = navigation?.extras?.state?.['data'] || null;

    if (!this.data) {
      alert('No data available. Please go back and try again.');
      this.router.navigate(['/analyze-trends']);
    }
  }
}
