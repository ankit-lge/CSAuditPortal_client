import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuditClaimUpload } from './components/audit-claim-upload/audit-claim-upload';
import { AuditMonitoringDashboard } from './components/audit-monitoring-dashboard/audit-monitoring-dashboard';
import { AuditReviewProcess } from './components/audit-review-process/audit-review-process';
import { AuditEvaluationProcess } from './components/audit-evaluation-process/audit-evaluation-process';
import { FeedbackStatus } from './components/feedback-status/feedback-status';
import { AuditSummaryReport } from './components/audit-summary-report/audit-summary-report';

const routes: Routes = [
  { path: 'audit-claim-upload', component: AuditClaimUpload },
  { path: 'audit-monitoring-dashboard', component: AuditMonitoringDashboard },
  { path: 'review', component: AuditReviewProcess },
  { path: 'evaluation', component: AuditEvaluationProcess },
  {path: 'FeedbackStatus', component: FeedbackStatus},
  {path: 'AuditSummaryReport', component: AuditSummaryReport},
  { path: '', redirectTo: '/audit-claim-upload', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
