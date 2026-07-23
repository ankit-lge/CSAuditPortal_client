import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

import { NavBar } from './pages/nav-bar/nav-bar';
import { Header } from './pages/header/header';
import { AuditMonitoringDashboard } from './components/audit-monitoring-dashboard/audit-monitoring-dashboard';
import { AuditReviewProcess } from './components/audit-review-process/audit-review-process';
import { AuditEvaluationProcess } from './components/audit-evaluation-process/audit-evaluation-process';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { AuditClaimUpload } from './components/audit-claim-upload/audit-claim-upload';
import { CommonModule } from '@angular/common';
import { Modalpopup } from './common/modalpopup/modalpopup';
import { AlertModal } from './pages/alert-modal/alert-modal';
import { RouteLoader } from './core/loader/route-loader/route-loader';

import { ApiLoader } from './core/loader/api-loader/api-loader';
import { apiLoaderInterceptor } from './core/interceptor/api-loader-interceptor';
import { FeedbackStatusReport } from './components/feedback-status-report/feedback-status-report';
import { AuditSummaryReport } from './components/audit-summary-report/audit-summary-report';
import { BulkLoader } from './core/loader/bulk-loader/bulk-loader';
import { UnAuthorise } from './pages/un-authorise/un-authorise';

@NgModule({
  declarations: [
    App,
    AuditClaimUpload,
    NavBar,
    Header,
    AuditMonitoringDashboard,
    AuditReviewProcess,
    AuditEvaluationProcess,
    Modalpopup,
    ApiLoader,
    AlertModal,
    RouteLoader,
    FeedbackStatusReport,
    AuditSummaryReport,
    BulkLoader,
    UnAuthorise,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: apiLoaderInterceptor,
      multi: true,
    },
  ],
  bootstrap: [App],
})
export class AppModule {}
