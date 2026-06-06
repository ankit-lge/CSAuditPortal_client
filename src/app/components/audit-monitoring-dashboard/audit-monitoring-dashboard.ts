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

    this.selectedStatus = 'pending';

    // Optional default values
    this.monitoring.patchValue({
      status: '',
      auditType: '',
      fromDate: '',
      toDate: '',
    });

    console.log('Form Reset Successfully');
  }
 DownloadExcel(): void {

  const payload = {
    status: this.monitoring.value.status,
    auditType: this.monitoring.value.auditType,
    fromDate: this.monitoring.value.fromDate,
    toDate: this.monitoring.value.toDate
  };
  console.log('Download Button Clicked');
  console.log('Payload:', payload);
  this.auditService.SearchAuditMoniter(payload)
    .subscribe((res: any) => {
       console.log('Download Response:', res);
       alert('Response received successfully');

    if (!Array.isArray(res) || res.length === 0){
        this.alertService.show('warning', 'No data found');
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(res);

      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        'AuditMonitoring'
      );

      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });

      const blob = new Blob(
        [excelBuffer],
        {
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
        }
      );

      FileSaver.saveAs(
        blob,
        `Audit_${this.selectedStatus}.xlsx`
      );
    });
}


  // REJECT REQUEST
  rejectRequest() {
    if (confirm('Are you sure you want to reject this request?')) {
      console.log('Rejected Data:', this.monitoring.value);

      // API CALL
      /*
      this.auditService.rejectRequest(this.monitoring.value)
        .subscribe({
          next: (res) => {
            alert('Request Rejected Successfully');
          },
          error: (err) => {
            console.log(err);
          }
        });
      */

      alert('Reject API Pending');
    }
  }

  // DELETE DATA
  deleteData() {
    if (confirm('Are you sure you want to delete this record?')) {
      console.log('Delete Data:', this.monitoring.value);

      // API CALL
      /*
      this.auditService.deleteData(this.monitoring.value)
        .subscribe({
          next: (res) => {
            alert('Deleted Successfully');
          },
          error: (err) => {
            console.log(err);
          }
        });
      */

      alert('Delete API Pending');
    }
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
