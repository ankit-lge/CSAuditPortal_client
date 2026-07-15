
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportService } from '../../services/report-service';
import { AlertService } from '../../services/alert-service';
import { Branch } from '../../core/interfaces/branch-data';

@Component({
  selector: 'app-feedback-status-report',
  standalone: false,
  templateUrl: './feedback-status-report.html',
  styleUrls: ['./feedback-status-report.css']
})
export class FeedbackStatusReport implements OnInit {
   private reportService = inject(ReportService);
   private alertService = inject(AlertService);
   branches: Branch[] = [];
  searchData: FeedbackStatusReportModel[] = [];
  filterData: FeedbackStatusReportModel[] = [];
  feedbackForm!: FormGroup;
  maxMonth = "";
  private fb = inject(FormBuilder);


 ngOnInit(): void {
  const today = new Date();
const currentMonth =
  `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
this.maxMonth = currentMonth;
this.feedbackForm = this.fb.group({
  branchCode: [''],
  fromAuditDate: [currentMonth, Validators.required]
});

  // Load branches for dropdown
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

searchfeedbackreport(){
  const [year, month] = this.feedbackForm.value.fromAuditDate.split('-');

const payload = {
  BranchCode: this.feedbackForm.value.branchCode,
  Month: `${month}-${year}` // 07-2026
};
  this.reportService.searchfeedbackreport(payload).subscribe({
    next : (res:any) =>{
      this.searchData = res?.data
      this.filterData = [...res?.data]
    },
    error: (err: any)=>{
      console.log(err)
      this.alertService.show("error", err.Error);
    }
  })
}

exportExcelData(){
  const [year, month] = this.feedbackForm.value.fromAuditDate.split('-');
  const payload = {
    BranchCode: this.feedbackForm.value.branchCode,
    Month: `${month}-${year}` // 07-2026
  };

  this.reportService.downloadFeedbackReport(payload).subscribe({
    next : (res:any)=> this.processDownloadFile(res),
    error: (err:any) => this.handleError(err)
  })
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
