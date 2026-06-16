
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { ReportService } from '../../services/report-service';
import { AlertService } from '../../services/alert-service';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { FeedBackData } from '../../core/interfaces/feedback-status-data';
import { Branch } from '../../core/interfaces/branch-data';

@Component({
  selector: 'app-feedback-status-report',
  standalone: false,
  templateUrl: './feedback-status-report.html',
  styleUrls: ['./feedback-status-report.css']
})
export class FeedbackStatusReport implements OnInit, OnDestroy {

  @ViewChild('pickerContainer') pickerContainer!: ElementRef;
   private reportService = inject(ReportService);
   private alertService = inject(AlertService);
   branches: Branch[] = [];
  displayValue: string = '';
  nativeValue: string = '';
searchData: FeedBackData[] = [];
filterData: FeedBackData[] = [];
searchText: string = '';
  totalCount: number = 0;
  selectedMonth: number | null = null;
  selectedYear: number | null = null;
  pickerYear: number = new Date().getFullYear();
  isPickerOpen: boolean = false;
  feedbackForm!: FormGroup;
  feedBackData:any;
  readonly months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  readonly today = new Date();
  readonly currentYear = this.today.getFullYear();
  readonly startYear = this.currentYear - 10;
  private fb = inject(FormBuilder);
  private clickListener!: () => void;
  

  constructor(
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

 ngOnInit(): void {

  // Initialize form
  this.feedbackForm = this.fb.group({
    branchCode: [''],
    month: [''],
    year: [''],
    userRole: [''],
    loggedInBranch: ['']
  });

  // Load branches for dropdown
  this.loadBranches();

  // Close picker on outside click
  this.clickListener = this.renderer.listen(
    'document',
    'click',
    (event: Event) => {

      const container = this.pickerContainer?.nativeElement;

      if (
        container &&
        !container.contains(event.target as Node)
      ) {
        this.isPickerOpen = false;
      }
    }
  );
 
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
ngOnDestroy(): void {

  if (this.clickListener) {
    this.clickListener();
  }
}
  togglePicker(): void {
    this.isPickerOpen = !this.isPickerOpen;
    if (this.isPickerOpen) {
      this.pickerYear = this.selectedYear ?? this.currentYear;
    }
  }

  changeYear(dir: number): void {
    const next = this.pickerYear + dir;
    if (next >= this.startYear && next <= this.currentYear) {
      this.pickerYear = next;
    }
  }

  isFutureMonth(monthIndex: number): boolean {
    return (
      this.pickerYear > this.currentYear ||
      (this.pickerYear === this.currentYear && monthIndex > this.today.getMonth())
    );
  }

  isSelected(monthIndex: number): boolean {
    return this.selectedYear === this.pickerYear && this.selectedMonth === monthIndex;
  }

 selectMonth(monthIndex: number): void {

  this.selectedMonth = monthIndex;
  this.selectedYear = this.pickerYear;

  const monthName = new Date(
    this.pickerYear,
    monthIndex
  ).toLocaleString(
    'default',
    { month: 'long' }
  );

  this.displayValue = `${monthName} ${this.pickerYear}`;

  const mm = String(monthIndex + 1).padStart(2, '0');

  this.nativeValue = `${this.pickerYear}-${mm}-01`;

  this.isPickerOpen = false;
}

  resetForm(): void {
    this.displayValue = '';
    this.nativeValue = '';
    this.selectedMonth = null;
    this.selectedYear = null;
    this.isPickerOpen = false;
  }

  onReset(): void {
  this.feedbackForm.reset();
  this.resetForm();
}

  onDownload(): void {
  const data = this.feedbackForm.value;
  const payload = {
    branchCode: data.branchCode,
    month: data.month,
    year: data.year,
    userRole: data.userRole,
    loggedInBranch: data.loggedInBranch
  };
 this.reportService.downloadData(payload).subscribe({
    next: (res: Blob) => {
      const blob = new Blob(
        [res],
        {
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download =
        `FeedbackReport_${new Date().getTime()}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      this.alertService.show(
        'success',
        'Excel downloaded successfully.');
    },
    error: (err) => {
      this.alertService.show(
        'error',
        'Failed to download Excel file.');
      console.error(err);
    }
  });
}
searchfeedbackreport(): void {

  const data = this.feedbackForm.value;

  const payload = {
    branchCode: data.branchCode,
    month: data.month,
    year: data.year,
    userRole: data.userRole,
    loggedInBranch: data.loggedInBranch
  };

  this.reportService
    .searchfeedbackreport(payload)
    .subscribe({

      next: (response: any) => {

        this.feedBackData = response.data;

        this.filterData = [...this.feedBackData];

        this.totalCount = response.totalCount;

        this.alertService.show(
          'success',
          'Data loaded successfully.'
        );
      },

      error: (error) => {

        console.error(error);

        this.alertService.show(
          'error',
          'Failed to load feedback report.'
        );
      }
    });
}
onSearch(): void {

  const search =
    this.searchText
      .trim()
      .toLowerCase();

  if (!search) {

    this.filterData = [
      ...this.searchData
    ];

    return;
  }

  this.filterData =
  this.searchData.filter(item =>

    Object.values(item).some(value =>

      String(value ?? '')
        .toLowerCase()
        .includes(search)
    )
);
}

}
