import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportService } from '../../services/report-service';
import { AlertService } from '../../services/alert-service';
import { Branch } from '../../core/interfaces/branch-data';


@Component({
  selector: 'app-audit-summary-report',
  standalone: false,
  templateUrl: './audit-summary-report.html',
  styleUrl: './audit-summary-report.css',
})
export class AuditSummaryReport implements OnInit {

  @ViewChild('pickerContainer') pickerContainer!: ElementRef;
  private reportService = inject(ReportService);
  private alertService = inject(AlertService);
  private fb = inject(FormBuilder);

  summaryform!: FormGroup;
  branches: Branch[] = [];
  filterData: any;

  ngOnInit(): void {
      const today = new Date();
const currentMonth =
  `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

    this.summaryform = this.fb.group({
      branchCode: [''],
      fromAuditDate: [currentMonth, Validators.required]
    });
    this.loadBranches();
  }
  loadBranches(): void {
  this.reportService.getBranches().subscribe({
    next: (response: Branch[]) => {
      this.branches = response;
    },
    error: (error) => {
      console.error(error);
    }
  });
}
  onReset(): void {
  this.summaryform.reset();
}

 searchsummaryreport(): void {
  const [year, month] = this.summaryform.value.fromAuditDate.split('-');

const payload = {
  BranchCode: this.summaryform.value.branchCode,
  Month: `${month}-${year}` // 07-2026
};
  this.reportService.searchSummaryReport(payload)
    .subscribe({
      next: (response: any) => {
        this.filterData = response?.data
      },
      error: (error:any) => this.handleError(error)
    });
}
  downloadExcelData(): void {
    const [year, month] = this.summaryform.value.fromAuditDate.split('-');
    const payload = {
      BranchCode: this.summaryform.value.branchCode,
      Month: `${month}-${year}` // 07-2026
    };
    this.reportService.downloadSummaryReport(payload)
      .subscribe({
        next: (response: any) => this.processDownloadFile(response),
        error: (error:any) => this.handleError(error)
      });
  }


  private handleError(
    err: any
  ): void {
    const message =
      err?.error?.message ||
      err?.error?.data?.message ||
      err?.error ||
      'Something went wrong. Please try again.';
this.alertService.show('error', message);
  }

private processDownloadFile(res:any){
    const blob = res.body;
    const contentDisposition = res.headers.get("content-disposition");
    let filename = 'download.xlsx';

    if (contentDisposition) {
      // Prefer filename*
      let match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);

      if (match?.[1]) {
        filename = decodeURIComponent(match[1]);
      } else {
        match = contentDisposition.match(/filename="?([^";]+)"?/i);

        if (match?.[1]) {
          filename = match[1];
        }
      }
    }

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;   // Uses filename from API

    a.click();

    window.URL.revokeObjectURL(url);
  }
}
