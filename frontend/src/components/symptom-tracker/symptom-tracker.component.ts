import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SymptomTrackerService } from './symptom-tracker.service';

@Component({
  selector: 'app-symptom-tracker',
  templateUrl: './symptom-tracker.component.html',
  styleUrl: './symptom-tracker.component.css'
})
export class SymptomTrackerComponent {
  symptomsData = [
    { symptom: 'Irregular Periods', mild: 'Cycle variation within 35-40 days, occasional missed periods', moderate: 'Cycles longer than 45 days, frequent missed periods', severe: 'No periods for months, heavy or prolonged bleeding' },
    { symptom: 'Acne', mild: 'Few pimples, mild breakouts', moderate: 'Persistent acne on face, back, or shoulders', severe: 'Severe cystic acne, painful breakouts' },
    { symptom: 'Mood Swings', mild: 'Occasional mood changes, slight irritability', moderate: 'Frequent anxiety or depressive episodes', severe: 'Severe anxiety or depression impacting daily life' },
    { symptom: 'Weight Gain', mild: 'Slight increase in weight, manageable with lifestyle', moderate: 'Noticeable weight gain around the abdomen', severe: 'Significant, rapid weight gain, hard to manage' },
    { symptom: 'Fatigue', mild: 'Occasional tiredness, feeling sleepy during the day', moderate: 'Persistent tiredness despite rest', severe: 'Extreme exhaustion affecting daily activities' },
    { symptom: 'Thinning Hair', mild: 'Slight hair thinning, some hair fall', moderate: 'Noticeable hair loss on scalp', severe: 'Significant hair loss, bald patches' },
    { symptom: 'Excessive Hair Growth', mild: 'Light facial hair growth', moderate: 'Noticeable hair growth on face, chest, or back', severe: 'Dense, thick hair growth in male-pattern areas' },
    { symptom: 'Darkened Skin Patches', mild: 'Slight skin darkening in some areas', moderate: 'Noticeable skin darkening in multiple areas', severe: 'Large dark patches, thickened skin' },
    { symptom: 'Pelvic Pain', mild: 'Mild discomfort occasionally', moderate: 'Frequent pelvic pain, worsens during periods', severe: 'Severe pelvic pain, impacts daily activities' },
    { symptom: 'Infertility', mild: 'Slight difficulty in conception', moderate: 'Struggling to conceive for months', severe: 'No ovulation, prolonged infertility struggles' },
    { symptom: 'Sleep Problems', mild: 'Occasional trouble sleeping', moderate: 'Frequent sleep disturbances, trouble staying asleep', severe: 'Severe insomnia, affects daily functioning' },
    { symptom: 'Bloating', mild: 'Mild bloating after meals or before periods', moderate: 'Frequent bloating, discomfort', severe: 'Persistent bloating with severe pain' },
    { symptom: 'Headaches', mild: 'Mild, occasional headaches', moderate: 'Frequent headaches, noticeable around cycles', severe: 'Severe migraines, disrupts daily life' },
    { symptom: 'High Blood Sugar', mild: 'Occasional sugar spikes', moderate: 'Frequent sugar level fluctuations', severe: 'High fasting blood sugar, signs of prediabetes or diabetes' },
    { symptom: 'High Cholesterol', mild: 'Slightly elevated cholesterol levels', moderate: 'Noticeable rise, borderline high cholesterol', severe: 'High cholesterol leading to health risks' }
  ];


  selectedSymptoms: any = {};
  doctorAdvice: string | null = null;
  recommendations: string | null = null;
  message: string | null = null;
  errorMessage: string | null = null;

  constructor(private symptomTrackerService: SymptomTrackerService, private router: Router) {}

  onSeverityChange(index: number, severity: 'mild' | 'moderate' | 'severe') {
    if (!this.selectedSymptoms[index]) {
      this.selectedSymptoms[index] = {};
    }

    if (this.selectedSymptoms[index][severity]) {
      // If the user unchecks the box, clear it
      this.selectedSymptoms[index][severity] = false;
    } else {
      // If a severity is selected, unselect other severities in the same row
      this.selectedSymptoms[index] = {
        mild: severity === 'mild',
        moderate: severity === 'moderate',
        severe: severity === 'severe'
      };
    }
  }

  displaySelectedSymptoms() {
    const selected: { name: string; severity: string; }[] = [];

    this.symptomsData.forEach((item, index) => {
      if (this.selectedSymptoms[index]) {
        (Object.keys(this.selectedSymptoms[index]) as ('mild' | 'moderate' | 'severe')[])
          .forEach(severity => {
            if (this.selectedSymptoms[index][severity]) {
              selected.push({
                name: item.symptom,
                severity: severity.charAt(0).toUpperCase() + severity.slice(1)
              });
            }
          });
      }
    });
    return selected;
  }

  submitSymptoms() {
    const selectedData = this.displaySelectedSymptoms();

    if (selectedData.length === 0) {
      alert('Please select at least one symptom before submitting!');
      return;
    }

    const username = localStorage.getItem('username');
    if (!username) {
      alert('User not logged in. Please log in first.');
      return;
    }

    const requestBody = {
      username,
      symptoms: selectedData,
      date_time: new Date().toISOString()
    };

    this.symptomTrackerService.submitSymptoms(requestBody).subscribe({
      next: (response: {
        recommendations: string | null;
        doctor_advice: string | null; message: any; 
}) => {
        console.log('Symptoms submitted successfully:', response);
        this.router.navigate(['/results'], { state: { data: response } });
      },
      error: (error: { error: { error: string; }; }) => {
        console.error('Error submitting symptoms:', error);
        const errorMessage = error.error?.error || 'Failed to submit symptoms. Please try again later.';
        alert(errorMessage);
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}

