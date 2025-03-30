import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})
export class ResourcesComponent {
  constructor(private router: Router) {}
  resources = [
    { title: 'Causes, diagnosis and symptoms', link: 'https://www.askpcos.org/topics/causes-diagnosis-and-symptoms/', image: 'assets/1.png' },
    { title: 'Fertility', link: 'https://www.askpcos.org/topics/fertility/', image: 'assets/2.png' },
    { title: 'Periods', link: 'https://www.askpcos.org/topics/periods/', image: 'assets/3.png' },
    { title: 'Skin and hair', link: 'https://www.askpcos.org/topics/skin-and-hair/', image: 'assets/4.png' },
    { title: 'Long term health conditions', link: 'https://www.askpcos.org/topics/long-term-health-conditions/', image:'assets/5.png' },
    { title: 'Management and treatment', link: 'https://www.askpcos.org/topics/management-and-treatment/', image: 'assets/6.png' },
    { title: 'Sexual health and relationships', link: 'https://www.askpcos.org/topics/sexual-health-and-relationships/', image: 'assets/7.png' },
    { title: 'Weight stigma', link: 'https://www.askpcos.org/topics/weight-stigma/', image: 'assets/8.png' },
  ];

  redirectTo(url: string) {
    window.open(url, '_blank'); // Opens in a new tab
  }
  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
