import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { AuditService } from '../../services/audit.service';
import { AlertService } from '../../services/alert-service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
declare var $: any;


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
  selectedStatus: string = '';
  auditTypes: auditType[] = [];
  auditTypes$!: Observable<auditType[]>;
  monitoring!: FormGroup;
  selectAll: boolean = false;
searchText: string = '';
verifyMoniotringData: any[] = [];
pagedData: any[] = [];
currentPage: number = 1;
pageSize: number = 10;
totalPages: number = 0;
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
      console.log("searching params :", this.monitoring.value);
      
      this.monitoring.markAllAsTouched();
      return;
    }
    var data = this.monitoring.value;
    const payload = {
      auditStatus: data.status,
      auditTypeId: data.auditType,
      fromDate: data.fromDate.replace(/\//g, ''),
      toDate: data.toDate.replace(/\//g, ''),
      page: 1,
      limit: 10,
    };
    this.auditService.searchAuditData(payload).subscribe({
      next: (res) => {
        this.alertService.show('success', 'Data fetched successfully !');
      },
      error: (err) => {
        console.error(err, "Error found.");
        
        this.alertService.show('error', 'No data found.');
      },
    });
  }
  updateAllMonitoringState(): void {
  this.selectAll =
    this.verifyMoniotringData.length > 0 &&
    this.verifyMoniotringData.every(
      (item: any) => item.selected
    );
}
getEndRecord(): number {
  return Math.min(
    this.currentPage * this.pageSize,
    this.verifyMoniotringData.length
  );
}

   toggleAllSelection(): void {
    this.verifyMoniotringData.forEach((item: any) => {
      item.selected = this.selectAll;
    });
  }
  calculatePagination(): void {
  this.totalPages = Math.ceil(
    this.verifyMoniotringData.length / this.pageSize
  );
  this.loadPage(1);
}

loadPage(page: number): void {
  this.currentPage = page;
  const start =
    (page - 1) * this.pageSize;
  const end =
    start + this.pageSize;
  this.pagedData =
    this.verifyMoniotringData.slice(start, end);
}
onPageSizeChange(): void {
  this.calculatePagination();
}
previousPage(): void {
  if (this.currentPage > 1) {
    this.loadPage(this.currentPage - 1);
  }
}
nextPage(): void {

  if (this.currentPage < this.totalPages) {
    this.loadPage(this.currentPage + 1);
  }
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
  this.pagedData = [];
  this.showTable = false;
  this.selectAll = false;
  console.log('Form Reset Successfully');
}
DownloadExcel() {

  const selectedRows =
    this.verifyMoniotringData
        .filter(x => x.selected);

  if (selectedRows.length === 0) {

    this.alertService.show(
      'Validation',
      'Please select at least one record.',
     );

    return;
  }

 const request = {
  ids: selectedRows.map(x => x.id),
  claimNos: selectedRows.map(x => x.claimNo),
  auditType: this.monitoring.get('auditType')?.value,
  shipToCodes: selectedRows.map(x => x.shipToCode)
};
  this.auditService .downloadExcel(request)  .subscribe({
        next: (response: Blob) => {
          const blob =  new Blob( [response],
              {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              });

          const url = window.URL .createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download =  `AuditReport_${new Date().getTime()}.xlsx`;
          link.click();

          window.URL.revokeObjectURL(url);

           this.alertService.show(
            'Success',
            'Excel downloaded successfully.',
           );
        },
        error: () => {

           this.alertService.show(
            'Error',
            'Failed to download excel.',
            );
        }
      });
}

  // REJECT REQUEST
  rejectRequest() {
  const selectedRows =
    this.verifyMoniotringData
        .filter(x => x.selected);
  if (selectedRows.length === 0) {
    this.alertService.show(
      'error',
      'Please select at least one record.');
    return;
  }

  const reason =
    prompt(
      'Enter rejection reason');
  if (!reason) {
    return;
  }

  const request = {
    ids:  selectedRows .map(x => x.id),reason: reason
  };

  this.auditService .RejectStatus(request)
      .subscribe({ next: (res: any) => {
          this.alertService.show(
            'success',
            'Rejected successfully.');
          this.auditMonitoringForm();
        },
        error: (err) => {
          this.alertService.show(
            'error',
            err.error?.message ||
            'Reject failed.');
        }
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
