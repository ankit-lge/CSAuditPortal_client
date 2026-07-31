import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuditClaimUpload } from './components/audit-claim-upload/audit-claim-upload';
import { AuditMonitoringDashboard } from './components/audit-monitoring-dashboard/audit-monitoring-dashboard';
import { AuditReviewProcess } from './components/audit-review-process/audit-review-process';
import { AuditEvaluationProcess } from './components/audit-evaluation-process/audit-evaluation-process';
import { FeedbackStatusReport } from './components/feedback-status-report/feedback-status-report';
import { AuditSummaryReport } from './components/audit-summary-report/audit-summary-report';
import { UnAuthorise } from './pages/un-authorise/un-authorise';
import { LandingPage } from './components/landing-page/landing-page';
import { Header } from './pages/header/header';

const routes: Routes = [
  {
    path : '',
    component : Header,
    children : [
      { path: 'audit-claim-upload', component: AuditClaimUpload },
      { path: 'audit-monitoring-dashboard', component: AuditMonitoringDashboard },
      { path: 'review', component: AuditReviewProcess },
      { path: 'evaluation', component: AuditEvaluationProcess },
      { path: 'feedback-status-report',component: FeedbackStatusReport },
      { path: 'audit-summary-report', component: AuditSummaryReport },
    ]
  },
  {path: 'landing', component : LandingPage},
  { path: 'unauthorise', component: UnAuthorise},
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
{path: '**', component: LandingPage}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
