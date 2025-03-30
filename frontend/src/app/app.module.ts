import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, Routes } from "@angular/router";
import { DialogModule } from "@angular/cdk/dialog";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DashboardComponent } from "../components/dashboard/dashboard.component";
import { LoginComponent } from "../components/login/login.component";
import { SignupComponent } from "../components/signup/signup.component";
import { FormsModule } from "@angular/forms";
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClientModule } from '@angular/common/http';
import { PeriodCycleLoggerComponent } from "../components/period-cycle-logger/period-cycle-logger.component";
import { AnalyzeTrendsComponent } from "../components/analyze-trends/analyze-trends.component";
import { SymptomTrackerComponent } from "../components/symptom-tracker/symptom-tracker.component";  
import { ResourcesComponent } from "../components/resources/resources.component";
import { ResultsComponent } from '../components/results/results.component';

const routes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent,
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "signup",
    component: SignupComponent,
  },
  {
    path: "period-cycle-logger",
    component: PeriodCycleLoggerComponent,
  },
  {
    path: "symptom-tracker",
    component: SymptomTrackerComponent,
  },
  {
    path: "analyze-trends",
    component: AnalyzeTrendsComponent,
  },
  { path: 'resources', 
  component: ResourcesComponent },
  {
    path: "results",
    component: ResultsComponent,
  }

];

@NgModule({
  declarations: [    AppComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    PeriodCycleLoggerComponent,
    AnalyzeTrendsComponent,
    ResourcesComponent,
    SymptomTrackerComponent,
  ResultsComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    DialogModule,
    FormsModule,
    MatTableModule,
    MatCheckboxModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
  ],
  exports: [],
  bootstrap: [AppComponent],
  providers: [],
})
export class AppModule {}
