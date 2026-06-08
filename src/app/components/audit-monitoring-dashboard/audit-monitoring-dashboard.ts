import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { AuditService } from '../../services/audit.service';
import { AlertService } from '../../services/alert-service';
import {VerifyAuditData} from '../../core/interfaces/verify-audit-data';
declare var $: any;
import 'datatables.net';
interface auditType {
  ID: Number;
  VALUE: string;
}

@Component({
  selector: 'app-audit-monitoring-dashboard',
  standalone: false,
  templateUrl: './audit-monitoring-dashboard.html',
  styleUrls: ['./audit-monitoring-dashboard.css'],
})
export class AuditMonitoringDashboard implements OnInit {
  Math = Math;
  selectedStatus: string = '';
  auditTypes: auditType[] = [];
  auditTypes$!: Observable<auditType[]>;
  monitoring!: FormGroup;
  selectAll: boolean = false;
  searchText: string = '';
  verifyMoniotringData: VerifyAuditData[] = [];
  filteredData: VerifyAuditData[] = []; 
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  totalRecords: number = 0;
  pageSizes: number[] = [10, 25, 50, 100];
  selectedRows: any[] = [];
  showTable: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private auditService: AuditService,
    private alertService: AlertService,
  ) {
    this.auditTypes$ = this.auditService.getAuditDropdown();
  }

  ngOnInit(): void {
    this.monitoring = this.fb.group({
      status: ['', Validators.required],
      auditType: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
    });
  }

  auditMonitoringForm() {
    if (this.monitoring.invalid) {
      console.log('searching params :', this.monitoring.value);

      this.monitoring.markAllAsTouched();
      return;
    }
    this.loadData(1);
  }

  loadData(page: number) {

  const formData = this.monitoring.value;

  const payload = {
    auditStatus: formData.status,
    auditTypeId: formData.auditType,
    fromDate: formData.fromDate.replace(/\//g, ''),
    toDate: formData.toDate.replace(/\//g, ''),
    page: page,
    limit: this.pageSize
  };

  this.auditService.searchAuditData(payload)
    .subscribe(res => {

      this.verifyMoniotringData = res.data;

      this.filteredData = [...res.data];
      this.totalRecords = res.totalRecords;

      this.currentPage = page;
      this.totalPages = Math.ceil(
        this.totalRecords / this.pageSize
      );

      this.showTable = true;
    });
}
onSearch(){
  const search = this.searchText.trim().toLowerCase();
  if (!search) {
    this.filteredData = [...this.verifyMoniotringData];
    return;
  }

  this.filteredData = this.verifyMoniotringData.filter(item =>
    Object.values(item).some(value =>
      String(value ?? '')
        .toLowerCase()
        .includes(search)
    )
  );
}

changePageSize() {
  this.currentPage = 1;
  this.loadData(this.currentPage);
}
nextPage() {
  if (this.currentPage < this.totalPages) {
    this.loadData(this.currentPage + 1);
  }
}

previousPage() {
  if (this.currentPage > 1) {
    this.loadData(this.currentPage - 1);
  }
}
  updateAllMonitoringState(): void {
    this.selectAll =
      this.verifyMoniotringData.length > 0 &&
      this.verifyMoniotringData.every((item: any) => item.selected);
  }
  getEndRecord(): number {
    return Math.min(this.currentPage * this.pageSize, this.verifyMoniotringData.length);
  }

  toggleAllSelection(): void {
    this.verifyMoniotringData.forEach((item: any) => {
      item.selected = this.selectAll;
    });
  }

  get pages(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((x, i) => i + 1);
  }

  // RESET FORM
  resetForm() {
    this.monitoring.reset();
    this.selectedStatus = '';
    this.verifyMoniotringData = [];
    this.showTable = false;
    this.selectAll = false;
    console.log('Form Reset Successfully');
  }
  DownloadExcel() {
    let selectedIds: any[] = this.verifyMoniotringData
      .filter((x: any) => x.selected)
      .map((x: any) => x.GSFS_RECEIPT_NO);

      if (selectedIds.length === 0) {
      this.alertService.show('warning', 'Please select atleast one data to start process.');
      return;
    }
    const request = {
      auditTypeId: this.monitoring.get('auditType')?.value,
      GSFS_Receipt_Nos: selectedIds,
    };
    this.auditService.downloadExcel(request).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `AuditReport_${new Date().getTime()}.xlsx`;
        link.click();

        window.URL.revokeObjectURL(url);

        this.alertService.show('success', 'Excel downloaded successfully.');
      },
      error: () => {
        this.alertService.show('error', 'Failed to download excel.');
      },
    });
  }

  // REJECT REQUEST
  rejectRequest() {
    let selectedIds: any[] = this.verifyMoniotringData
      .filter((x: any) => x.selected)
      .map((x: any) => x.GSFS_RECEIPT_NO);

      if (selectedIds.length === 0) {
      this.alertService.show('warning', 'Please select atleast one data to start process.');
      return;
    }
    const request = {
      auditTypeId: this.monitoring.get('auditType')?.value,
      GSFS_Receipt_Nos: selectedIds,
    };

    this.auditService.RejectStatus(request).subscribe({
      next: (res: any) => {
        this.alertService.show('success', 'Rejected successfully.');
        setTimeout(() => {
          this.auditMonitoringForm();
        }, 100);
      },
      error: (err) => {
        this.alertService.show('error', err.error?.message || 'Reject failed.');
      },
    });
  }

  onSearchByDate(event: any) {
    if (!event.target.checked) {
      this.router.navigate(['/audit-claim-upload']);
    }
  }

  ngAfterViewInit(): void {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 10;

    $('.datepicker').datepicker({
      dateFormat: 'yy/mm/dd',
      changeMonth: true,
      changeYear: true,
      yearRange: startYear + ':' + currentYear,
      maxDate: 0,

      onSelect: (dateText: string, inst: any) => {
        const controlName = $(inst.input).attr('formControlName');
        if (controlName) {
          this.monitoring.get(controlName)?.setValue(dateText);
        }
      },
    });
    $('.calendar-icon').on('click', (event: any) => {
      $(event.currentTarget).siblings('input.datepicker').datepicker('show');
    });

  }
}
