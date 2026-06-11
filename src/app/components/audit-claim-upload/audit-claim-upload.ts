import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuditService } from '../../services/audit.service';
import { Observable } from 'rxjs';
import { ViewChild, ElementRef } from '@angular/core';
import { AlertService } from '../../services/alert-service';
import { VerifyAuditData } from '../../core/interfaces/verify-audit-data';
declare var $: any;

declare var bootstrap: any;

interface auditType {
  ID: Number;
  VALUE: string;
}

@Component({
  selector: 'app-audit-claim-upload',
  standalone: false,
  templateUrl: './audit-claim-upload.html',
  styleUrls: ['./audit-claim-upload.css'],
})
export class AuditClaimUpload implements OnInit {
  auditClaimUpload!: FormGroup;
  isFileUploaded: boolean = false;
  selectedFile: File | null = null;
  FileUploadedData: any[] = [];
  selectedAuditTypeId: any = '';
  verifyExcelUpload: boolean = false;
  auditTypes: auditType[] = [];
  status: string = '';
  rejectReason: string = '';
  auditTypes$!: Observable<auditType[]>;
  selectAll: boolean = false;
  sessionId: string = '12';
  verifyAuditData: VerifyAuditData[] = [];
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private auditService: AuditService,
    private alertservice: AlertService,
  ) {
    this.auditTypes$ = this.auditService.getAuditDropdown();
  }

  ngOnInit(): void {
    this.auditClaimUpload = this.fb.group({
      auditType: ['', Validators.required],
      fromDate: ['', Validators.required]
    });
  }

  resetForm(): void {
    // RESET REACTIVE FORM
    this.auditClaimUpload.reset();
    this.auditClaimUpload.markAsPristine();
    this.auditClaimUpload.markAsUntouched();
    // RESET VARIABLES
    this.FileUploadedData = [];
    this.selectedFile = null;
    this.isFileUploaded = false;

  }
  onSearchByDate(event: any) {
    if (event.target.checked) {
      this.router.navigate(['/audit-monitoring-dashboard']);
    }
  }

  modalTitle: string = '';
  modalMessage: string = '';
  modalType: string = '';

  openModal(title: string, message: string, type: string) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalType = type;

    const modalElement = document.getElementById('commonModal');

    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);

      modal.show();
    }
  }

  openUploadPopup() {
    this.openModal('Success', 'File uploaded successfully', 'success');
  }

  downloadTemplate() {
    const selectedAuditType = this.auditClaimUpload.get('auditType')?.value;

    if (!selectedAuditType) {
      this.openModal('Error', 'Please select audit type', 'error');

      return;
    }

    const templateFiles: any = {
      1: 'AMC_Incentive_Hold.xlsx',
      2: 'Beyond_AMC_Policy.xlsx',
      3: 'Claims_Self_Registration.xlsx',
      4: 'Data_Audit.xlsx',
      5: 'Gas_Overcharging.xlsx',
      6: 'Duplicate_Data.xlsx',
      7: 'Estimate_OW_AMC.xlsx',
      8: 'Extra_Filter_AMC.xlsx',
      9: 'Inside_Filters_IW_Wty.xlsx',
      10: 'Model_Change.xlsx',
      11: 'OOW_Claims.xlsx',
      12: 'Part_in_Labour.xlsx',
      13: 'Post_AMC_30_Days.xlsx',
      14: 'RF_Special_Model.xlsx',
      15: 'Suspicious_AMC.xlsx',
      16: 'Wrong_Part_Consumption.xlsx',
      17: 'Multiple_closure_same_day_same.xlsx',
      18: 'LGC_Part_Rejection.xlsx',
      19: 'LGC_Non_Part_Rejection.xlsx',
      20: 'Cancellation_Claim_Recovery.xlsx',
      21: 'Multiple_Bracket.xlsx',
    };

    const fileName = templateFiles[selectedAuditType];

    if (!fileName) {
      this.openModal('Error', 'Template not found', 'error');

      return;
    }

    const filePath = `assets/templates/${fileName}`;

    console.log(filePath);

    const link = document.createElement('a');

    link.href = filePath;

    link.download = fileName;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  }

  UploadFile(event: any): void {
  const file = event.target.files?.[0];

  if (file) {
    this.selectedFile = file;
  }
}

  ProcessUploadData() {
    if (this.auditClaimUpload.invalid || !this.selectedFile) {
      this.openModal(
        'Validation',
        'Kindly select the audit type and upload the Excel file.',
        'warning',
      );
      this.auditClaimUpload.markAllAsTouched();
      return;
    }
    const value = this.auditClaimUpload.value;
    const auditDate = this.formatDate(value.fromDate);
    const formData = new FormData();
    formData.append("file", this.selectedFile);
    formData.append("auditTypeId", value.auditType);
    formData.append("fromDate", auditDate);
    this.auditService.ProcessUploadData(formData).subscribe({
        next: (res) => {
           this.resetForm();
            this.openModal('Success', res.data || 'Data uploaded successfully.', 'success');
        },
        error: (err) => {
          this.openModal('Error', err?.error?.message || 'Failed to upload data.', 'error');
        },
      });
  }

  getUpdatedData() {
    const auditTypeId = this.auditClaimUpload.value?.auditType;
    if (!auditTypeId || auditTypeId == null || auditTypeId == '') {
      this.alertservice.show('warning', 'Please select an valid Audit Type to process');
      return;
    }
    const payload = {
      sessionId: this.sessionId,
      auditTypeId: auditTypeId,
    };

    this.auditService.searchAuditData(payload).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.verifyAuditData = res.data;
          this.verifyExcelUpload = true;
        }
      },
      error: (err) => {
        this.alertservice.show('error', 'Error Occured while fetching data');
      },
    });
  }

  toggleAllSelection(): void {
    this.verifyAuditData.forEach((item: any) => {
      item.selected = this.selectAll;
    });
  }

  updateSelectAllState(): void {
    this.selectAll =
      this.verifyAuditData.length > 0 && this.verifyAuditData.every((item: any) => item.selected);
  }

  saveStatus() {
    if (!this.status) {
      this.alertservice.show('warning', 'Please select a status');
      return;
    }

    let selectedIds: any[] = this.verifyAuditData
      .filter((x: any) => x.selected)
      .map((x: any) => x.GSFS_RECEIPT_NO);

    if (selectedIds.length === this.verifyAuditData.length) {
      selectedIds = ['ALL'];
    }
    if (selectedIds.length === 0) {
      this.alertservice.show('warning', 'Please select atleast one data to start process.');
      return;
    }
    const auditTypeId = this.auditClaimUpload.value?.auditType;
    if (!auditTypeId || auditTypeId == null || auditTypeId == '') {
      this.alertservice.show('warning', 'Please select an valid Audit Type to process');
      return;
    }
    const payload = {
      sessionId: this.sessionId,
      auditTypeId: auditTypeId,
      status: this.status,
      selectedIds: selectedIds,
    };
    this.auditService.SaveStatus(payload).subscribe({
      next: (res) => {
        this.alertservice.show('success', 'Successfully saved');
        this.verifyExcelUpload = false;
        this.toggleAllSelection();
      },
      error: (err) => {
        console.error('some error while saving data.', err);
      },
    });
  }

  rejectStatus() {
    if (!this.rejectReason) {
      this.alertservice.show('warning', 'Reject reason is mandetory');
      return;
    }

    let selectedIds: any[] = this.verifyAuditData
      .filter((x: any) => x.selected)
      .map((x: any) => x.GSFS_RECEIPT_NO);

    if (selectedIds.length === this.verifyAuditData.length) {
      selectedIds = ['ALL'];
    }

    if (selectedIds.length === 0) {
      this.alertservice.show('warning', 'Please select atleast one data to start process.');
      return;
    }
    const auditTypeId = this.auditClaimUpload.value?.auditType;
    if (!auditTypeId || auditTypeId == null || auditTypeId == '') {
      this.alertservice.show('warning', 'Please select an valid Audit Type to process');
      return;
    }
    const payload = {
      sessionId: this.sessionId,
      auditTypeId: auditTypeId,
      status: 'REJECT',
      reason: this.rejectReason,
      selectedIds: selectedIds,
    };

    this.auditService.DeleteUploadedData(payload).subscribe({
      next: (res) => {
        this.alertservice.show('success', 'Rejected successfully !');
        this.toggleAllSelection();
        this.verifyExcelUpload = false;
        this.rejectReason = '';
      },
      error: (err) => {
        console.error('Errro while rejecting', err);
      },
    });
  }

  // =====================================
  // DATE FORMAT METHOD
  // =====================================

  formatDate(date: any): string {
    if (!date) {
      return '';
    }

    const d = new Date(date);

    const year = d.getFullYear();

    const month = String(d.getMonth() + 1).padStart(2, '0');

    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  trackById(index: number, item: auditType) {
    return item.ID;
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

      const controlName =
        $(inst.input).attr('formControlName');

      if (controlName) {

        this.auditClaimUpload
          .get(controlName)
          ?.setValue(dateText);

        this.auditClaimUpload
          .get(controlName)
          ?.updateValueAndValidity();
      }
    }
  });

  $('.calendar-icon').on('click', (event: any) => {

    $(event.currentTarget)
      .siblings('input.datepicker')
      .datepicker('show');
  });
}
}
