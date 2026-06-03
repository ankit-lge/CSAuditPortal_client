import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { AuditService } from '../../services/audit.service';
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
  selectedStatus: string = 'pending';

  monitoring!: FormGroup;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private auditService: AuditService,
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

  auditTypes: auditType[] = [];

  auditTypes$!: Observable<auditType[]>;

  auditMonitoringForm() {
    // alert(1);
    console.log('auditMonifitoringForm value', this.monitoring.value);
    // api code

    // SEARCH / SUBMIT

    if (this.monitoring.invalid) {
      this.monitoring.markAllAsTouched();
      return;
    }

    console.log('auditMonitoringForm value', this.monitoring.value);

    // API CALL
    // this.auditService.searchData(this.monitoring.value).subscribe(...)
  }
  downloadData() {}

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
      maxDate: 0
    });
    $('.calendar-icon').on('click', (event: any) => {
      $(event.currentTarget)
        .siblings('input.datepicker')
        .datepicker('show');
    });
  }
}
