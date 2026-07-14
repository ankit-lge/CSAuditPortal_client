import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuditService } from '../../services/audit.service';
import { AlertService } from '../../services/alert-service';
import { VerifyAuditData } from '../../core/interfaces/verify-audit-data';
import { finalize } from 'rxjs';
declare var $: any;
declare var bootstrap: any;



@Component({
  selector: 'app-audit-claim-upload',
  standalone: false,
  templateUrl: './audit-claim-upload.html',
  styleUrls: ['./audit-claim-upload.css'],
})
export class AuditClaimUpload implements OnInit {
  auditClaimUpload!: FormGroup;
  selectedFile: File | null = null;
  FileUploadedData: any[] = [];
  verifyExcelUpload: boolean = false;
  status: string = '';
  rejectReason: string = '';
  auditTypeList : AuditType[] = [];
  selectAll: boolean = false;
  sessionId: string = '';
  errorCount: number = 0;
  verifyAuditData: VerifyAuditData[] = [];
<<<<<<< Updated upstream

  isUploading : boolean = false;
  progress = signal(0);
  statusMessage = signal("");

  modalTitle: string = '';
  modalMessage: string = '';
  modalType: string = '';

  private progressTimer: ReturnType<typeof setInterval> | null = null;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private auditService: AuditService,
    private alertservice: AlertService,
<<<<<<< Updated upstream
  ) {}
=======
  
  ) {
    this.auditTypes$ = this.auditService.getAuditDropdown();
  }
>>>>>>> Stashed changes

  ngOnInit(): void {
    this.auditClaimUpload = this.fb.group({
      auditType: ['', Validators.required],
      fromDate: ['', Validators.required],
<<<<<<< Updated upstream
      uploadedData :[null, Validators.required]
=======
  
>>>>>>> Stashed changes
    });

    this.auditService.getAuditDropdown().subscribe({
      next: (res:any)=>{
        this.auditTypeList = res
      },
      error : (err) => this.handleError(err)
    })
  }

  ngOnDestroy(): void {

    this.stopProgress();

    $('.calendar-icon').off('click');

    $('.datepicker').datepicker('destroy');

}
  resetForm(): void {
<<<<<<< Updated upstream
    // RESET REACTIVE FORM
    this.auditClaimUpload.reset();
    // RESET VARIABLES
    this.FileUploadedData = [];
    this.selectedFile = null;
    this.fileInput.nativeElement.value = '';
    this.rejectReason = '';
    this.status = '';
  }
=======
  this.auditClaimUpload.reset();

  this.auditClaimUpload.markAsPristine();
  this.auditClaimUpload.markAsUntouched();

  this.FileUploadedData = [];
  this.selectedFile = null;
  this.isFileUploaded = false;
}
>>>>>>> Stashed changes
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

  downloadTemplate() {
    const selectedAuditType = this.auditClaimUpload.get('auditType')?.value;

    if (!selectedAuditType) {
      this.alertservice.show('error', 'Please select audit type');
      return;
    }
    this.auditService.downloadAuditTemplate(selectedAuditType).subscribe({
      next: (res: any)=>this.processDownloadFile(res),
      error:(err:any) =>this.handleError(err)
    })
  }

<<<<<<< Updated upstream
  downloadErrorFile() {
    const selectedAuditType = this.auditClaimUpload.get('auditType')?.value;

    if (!selectedAuditType) {
      this.alertservice.show('error', 'Please select audit type');
      return;
    }

    this.auditService.downloadErrorData(selectedAuditType, this.sessionId).subscribe({
      next: (res: any)=> this.processDownloadFile(res),
      error:(err:any) =>this.handleError(err)
    })
  }

  UploadFile(event: any): void {
=======
 UploadFile(event: any): void {

>>>>>>> Stashed changes
  const file = event.target.files?.[0];

  if (file) {
    this.selectedFile = file;
<<<<<<< Updated upstream
    this.auditClaimUpload.patchValue({
      uploadedData: file.name
    });

    this.auditClaimUpload.get('uploadedData')?.updateValueAndValidity();
=======
  } else {
    this.selectedFile = null;
>>>>>>> Stashed changes
  }
}
 ProcessUploadData() {

<<<<<<< Updated upstream
  ProcessUploadData() {
    if(this.isUploading){
      return;
    }
    if (this.auditClaimUpload.invalid || !this.selectedFile) {
      this.openModal(
        'Validation',
        'Kindly select the audit type and upload the Excel file.',
        'warning',
      );
      this.auditClaimUpload.markAllAsTouched();
      return;
    }
    this.isUploading = true;
    const value = this.auditClaimUpload.value;
    const auditDate = this.formatDate(value.fromDate);
    const formData = new FormData();
    formData.append("file", this.selectedFile);
    formData.append("auditTypeId", value.auditType);
    formData.append("fromDate", auditDate);

    this.startProgress();
    this.auditService.ProcessUploadData(formData)
    .pipe(
      finalize(() =>{
        this.stopProgress();
        this.isUploading = false;
      })
    )
    .subscribe({
        next: (res) => this.handleSuccess({
          message: res?.data?.message,
          useModal: true,
          callback: () =>{
            const data = res.data;
            this.sessionId = data.sessionId;
            this.errorCount = data.error;
          }
        }),
        error: (err) => {
          if(err?.error?.data){
            const data = err.error.data;
            this.sessionId = data.sessionId
            this.errorCount = data.error;
            this.handleError(err);
          }else{
            this.handleError(err, true);
          }
        },
      });
=======
  this.isSubmitted = true;

  if (this.auditClaimUpload.invalid) {

    this.auditClaimUpload.markAllAsTouched();

    this.openModal(
      'Validation',
      'Please select Audit Type and Audit Date.',
      'warning'
    );

    return;
>>>>>>> Stashed changes
  }

  if (!this.selectedFile) {

    this.openModal(
      'Validation',
      'Please upload an Excel file.',
      'warning'
    );

    return;
  }

  const value = this.auditClaimUpload.value;

  const auditDate = this.formatDate(value.fromDate);

  const formData = new FormData();

  formData.append('file', this.selectedFile);
  formData.append('auditTypeId', value.auditType);
  formData.append('fromDate', auditDate);

  this.auditService.ProcessUploadData(formData)
    .subscribe({
      next: (res) => {

        this.sessionId = res.sessionId;

        this.openModal(
          'Success',
          res.data || 'Data uploaded successfully.',
          'success'
        );

      },
      error: (err) => {

        this.openModal(
          'Error',
          err?.error?.message ||
          'Failed to upload data.',
          'error'
        );
      }
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

    this.auditService.searchAuditData(payload)
    .pipe(
      finalize(() =>{
        this.verifyExcelUpload = false;
      })
    )
    .subscribe({
      next: (res: any) => this.handleSuccess({
        message: res?.message,
        useToast: true,
        callback: () =>{
          this.verifyAuditData = res.data;
          if(!res.success){
            this.alertservice.show("warning", res.message);
          }
        }
      }),
      error: (err) => {
        this.handleError(err);
      },
    });
  }

  toggleAllSelection(): void {
    this.verifyAuditData.forEach((item: any) => {
      item.selected = this.selectAll;
    });
    this.updateSelectAllState();
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
    const selectedIds = this.getSelectedIds();
    const auditTypeId = this.getAuditTypeId();
    if(!auditTypeId || auditTypeId == "0" || !selectedIds || selectedIds == null || selectedIds.length == 0)
      return;

    const payload = {
      sessionId: this.sessionId,
      auditTypeId: auditTypeId,
      status: this.status,
      selectedIds: selectedIds,
    };
    this.auditService.SaveStatus(payload).subscribe({
      next: (res:any) => this.handleSuccess({
        message: res?.message,
        useToast: true,
        callback: ()=>{
          this.verifyExcelUpload = false;
          this.toggleAllSelection();
          this.getUpdatedData();
          this.resetForm();
        }
      }),
      error: (err) => {
        this.handleError(err, false);
      }
    });
  }

  rejectStatus() {
    if (!this.rejectReason) {
      this.alertservice.show('warning', 'Reject reason is mandetory');
      return;
    }

    const selectedIds = this.getSelectedIds();
    const auditTypeId = this.getAuditTypeId();
    if(!auditTypeId || auditTypeId == "0" || !selectedIds || selectedIds == null || selectedIds.length == 0)
      return;

    const payload = {
      sessionId: this.sessionId,
      auditTypeId: auditTypeId,
      reason: this.rejectReason,
      selectedIds: selectedIds,
    };

    this.auditService.DeleteUploadedData(payload).subscribe({
      next: (res:any) => this.handleSuccess({
            message: res.message,
            useToast: true,
            callback: () => {
              this.verifyExcelUpload = false;
              this.toggleAllSelection();
              this.getUpdatedData();
              this.resetForm();
            }
          }),
      error: (err) => {
        this.handleError(err, false);
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

    return `${year}${month}${day}`;
  }

  trackById(index: number, item: AuditType) {
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


  // Re-usable functions 
  private handleError(
    err: any,
    useModal?: boolean
  ): void {
    const message =
      err?.error?.message ||
      err?.error?.data?.message ||
      err?.error ||
      'Something went wrong. Please try again.';

    if (useModal) {
      this.openModal('Error', message, 'error');
    } else {
      this.alertservice.show('error', message);
    }
  }
  private handleSuccess(options: {
    message?: string;
    title?: string;
    useModal?: boolean;
    useToast?: boolean;
    callback?: () => void;
  }): void {
    if (options.useModal) {
      this.openModal(
        options.title ?? 'Success',
        options.message ?? 'Operation completed successfully.',
        'success'
      );
    }

    if (options.useToast) {
      this.alertservice.show(
        'success',
        options.message ?? 'Operation completed successfully.'
      );
    }
    options.callback?.();
  }
  private getAuditTypeId(){
    const auditTypeId = this.auditClaimUpload.value?.auditType;
    if (!auditTypeId || auditTypeId == null || auditTypeId == '') {
      this.alertservice.show('warning', 'Please select an valid Audit Type to process');
      return null;
    }
    return auditTypeId;
  }
  private getSelectedIds(){
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

    return selectedIds;
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

  private startProgress(): void {
    this.progress.set(0);
    this.statusMessage.set('Preparing upload...');

    this.progressTimer = setInterval(() => {

      if (this.progress() >= 95) {
        return;
      }

      const currentProgress = this.progress() + 1;
      this.progress.set(currentProgress);

      if (currentProgress < 25) {
        this.statusMessage.set('Reading Excel file...');
      }
      else if (currentProgress < 50) {
        this.statusMessage.set('Validating records...');
      }
      else if (currentProgress < 80) {
        this.statusMessage.set('Uploading data...');
      }
      else {
        this.statusMessage.set('Processing records...');
      }

    }, 100);
  }

  private stopProgress(isSuccess: boolean = true): void {
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
    this.progress.set(isSuccess ? 100 : 0);
  }
}