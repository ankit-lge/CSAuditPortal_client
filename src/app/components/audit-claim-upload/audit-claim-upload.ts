import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuditService } from '../../services/audit.service';
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
  verifyExcelUpload: boolean = false;
  auditTypes: auditType[] = [];
  status: string = '';
  rejectReason: string = '';
  auditTypeList : AuditType[] = [];
  selectAll: boolean = false;
  sessionId: string = '';
  verifyAuditData: VerifyAuditData[] = [];

  isUploading : boolean = false;
  progress = signal(0);
  statusMessage = signal("");

  modalTitle: string = '';
  modalMessage: string = '';
  modalType: string = '';

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private auditService: AuditService,
    private alertservice: AlertService,
  ) {}

  ngOnInit(): void {
    this.auditClaimUpload = this.fb.group({
      auditType: ['', Validators.required],
      fromDate: ['', Validators.required],
      uploadedData :[null, Validators.required]
    });

    this.auditService.getAuditDropdown().subscribe({
      next: (res:any)=>{
        this.auditTypeList = res
      },
      error : err =>{
        this.alertservice.show("error",  "Some error found while fetchind audit type.");
      }
    })
  }

  resetForm(): void {
    // RESET REACTIVE FORM
    this.auditClaimUpload.reset();
    // RESET VARIABLES
    this.FileUploadedData = [];
    this.selectedFile = null;
    this.isFileUploaded = false;
    this.fileInput.nativeElement.value = '';
  }
  onSearchByDate(event: any) {
    if (event.target.checked) {
      this.router.navigate(['/audit-monitoring-dashboard']);
    }
  }

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
      this.alertservice.show('error', 'Please select audit type');
      return;
    }
    this.auditService.downloadAuditTemplate(selectedAuditType).subscribe({
      next: (res: any)=>{
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
      },
      error:(err:any) =>{
        this.alertservice.show("error", err);
      }
    })
  }

  UploadFile(event: any): void {
  const file = event.target.files?.[0];

  if (file) {
    this.selectedFile = file;
    this.auditClaimUpload.patchValue({
      uploadedData: file.name
    });

    this.auditClaimUpload.get('uploadedData')?.updateValueAndValidity();
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

    this.isUploading = true;
    const timer = setInterval(() =>{
      if (this.progress() < 95) {

      this.progress.set(this.progress()+1);

      if(this.progress() < 25)
        this.statusMessage.set('Reading Excel file...');

      else if(this.progress() < 50)
        this.statusMessage.set('Validating records...');

      else if(this.progress() < 80)
        this.statusMessage.set('Uploading data...');

      else
        this.statusMessage.set('Processing records...');
    }
    }, 100)

    this.auditService.ProcessUploadData(formData).subscribe({
        next: (res) => {
          clearInterval(timer);
          this.progress.set(100);
          this.isUploading = false;
          this.sessionId = res.sessionId;
          this.openModal('Success', res.data || 'Data uploaded successfully.', 'success');
        },
        error: (err) => {
          clearInterval(timer);
          this.isUploading = false;
          this.progress.set(0);
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