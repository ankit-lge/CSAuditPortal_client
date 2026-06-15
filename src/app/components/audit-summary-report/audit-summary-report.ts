import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { ReportService } from '../../services/report-service';
import { AlertService } from '../../services/alert-service';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-audit-summary-report',
  standalone: false,
  templateUrl: './audit-summary-report.html',
  styleUrl: './audit-summary-report.css',
})
export class AuditSummaryReport implements OnInit, OnDestroy {

  @ViewChild('pickerContainer') pickerContainer!: ElementRef;
  private reportService = inject(ReportService);
  private alertService = inject(AlertService);


  displayValue: string = '';
  nativeValue: string = '';
  selectedMonth: number | null = null;
  selectedYear: number | null = null;
  pickerYear: number = new Date().getFullYear();
  isPickerOpen: boolean = false;
  summaryform!: FormGroup;
  selectedIds: string[] = [];
  summaryData: any[] = [];
  totalCount = 0;
  branches: any[] = [];
  private clickListener!: () => void;

  readonly months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  readonly today = new Date();
  readonly currentYear = this.today.getFullYear();
  readonly startYear = this.currentYear - 10;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private fb: FormBuilder,

  ) { }

  ngOnInit(): void {
    this.summaryform = this.fb.group({
      branchCode: [''],
      month: [''],
      year: [''],
      userRole: [''],
      loggedInBranch: ['']
    });
    this.loadBranches();
    this.clickListener = this.renderer.listen(
      'document',
      'click',
      (event: Event) => {

        const container =
          this.pickerContainer?.nativeElement;

        if (
          container &&
          !container.contains(event.target as Node)
        ) {
          this.isPickerOpen = false;
        }
      });
  }
  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
  }
  loadBranches(): void {
    this.reportService.getBranches().subscribe({
      next: (response: any) => {
        this.branches = response;
      },
      error: (error) => {
        console.error(error);
        this.alertService.show(
          'error',
          'Failed to load branches.'
        );
      }
    });
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

  // selectMonth(monthIndex: number): void {
  //   this.selectedMonth = monthIndex;
  //   this.selectedYear = this.pickerYear;

  //   const monthName = new Date(this.pickerYear, monthIndex)
  //     .toLocaleString('default', { month: 'long' });
  //   this.displayValue = `${monthName} ${this.pickerYear}`;

  //   const mm = String(monthIndex + 1).padStart(2, '0');
  //   this.nativeValue = `${this.pickerYear}-${mm}-01`;

  //   this.isPickerOpen = false;
  // }
  selectMonth(monthIndex: number): void {

    this.selectedMonth = monthIndex;
    this.selectedYear = this.pickerYear;

    const monthName = new Date(
      this.pickerYear,
      monthIndex
    ).toLocaleString(
      'default',
      { month: 'long' });

    this.displayValue =
      `${monthName} ${this.pickerYear}`;

    const mm = String(
      monthIndex + 1
    ).padStart(2, '0');

    this.nativeValue =
      `${this.pickerYear}-${mm}-01`;

    // Store in form
    this.summaryform.patchValue({
      month: monthIndex + 1,
      year: this.pickerYear
    });

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
    this.summaryform.reset();
    this.resetForm();
  }

  searchsummaryreport(): void {
    const data = this.summaryform.value;
    const payload = {
      branchCode: data.branchCode,
      month: data.month,
      year: data.year,
      userRole: data.userRole,
      loggedInBranch: data.loggedInBranch
    };
    this.reportService.searchSummaryReport(payload)
      .subscribe({
        next: (response: any) => {
          this.summaryData = response.data;
          this.totalCount = response.totalCount;
          this.alertService.show(
            'success',
            // response.message
            'Data loaded successfully.'
          );
        },
        error: (error) => {
          console.error(error);
          this.alertService.show(
            'error',
            'Failed to load summary report.'
          );
        }
      });
  }

  downloadExcelData(): void {
    if (this.selectedIds.length === 0) {
      this.alertService.show(
        'warning',
        'Please select at least one record.'
      );
      return;
    }
    const payload = {
      selectedIds: this.selectedIds
    };
    this.reportService.downloadSummaryReport(payload)
      .subscribe({
        next: (response: Blob) => {
          const blob = new Blob(
            [response],
            {
              type:
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download =
            `SummaryStatus_${Date.now()}.xlsx`;
          link.click();
          window.URL.revokeObjectURL(url);
          this.alertService.show(
            'success',
            'Excel downloaded successfully.');
        },
        error: (error) => {
          console.error(error);
          this.alertService.show(
            'error',
            'Failed to download Excel.');
        }
      });
  }
}
