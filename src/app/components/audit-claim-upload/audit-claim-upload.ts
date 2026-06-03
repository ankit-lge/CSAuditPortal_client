import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuditService } from '../../services/audit.service';
import { Observable } from 'rxjs';
import { ViewChild, ElementRef } from '@angular/core';
import { AlertService } from '../../services/alert-service';
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
  FileUploadedData: any[] = [];
  uploadedFileName: string = '';
  uploadFileFullPath: string = '';
  selectedAuditTypeId: any = '';
  selectedFile: File | null = null;
  verifyExcelUpload: boolean = false;
  auditTypes: auditType[] = [];
  status: string = '';
  selectedIds: number[] = [];
  rejectReason: string = '';
  auditTypes$!: Observable<auditType[]>;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private auditService: AuditService,
    private alertservice: AlertService
  ) {
    this.auditTypes$ = this.auditService.getAuditDropdown();
  }

  ngOnInit(): void {
    this.auditClaimUpload = this.fb.group({
      auditType: ['', Validators.required],
      fromDate: ['', Validators.required],
      uploadedData: ['', Validators.required],
    });
  }

  @ViewChild('fileInput')
  fileInput!: ElementRef;

  resetForm(): void {
    // RESET REACTIVE FORM
    this.auditClaimUpload.reset();

    this.auditClaimUpload.markAsPristine();

    this.auditClaimUpload.markAsUntouched();

    // RESET VARIABLES
    this.FileUploadedData = [];

    this.uploadedFileName = '';

    this.isFileUploaded = false;

    // RESET FILE INPUT
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
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
  // downloadClaimUplaodExcel() {
  //   console.log(this.auditClaimUpload.get('auditType')?.value);

  //   if (this.auditClaimUpload.get('auditType')?.invalid) {
  //     this.auditClaimUpload.get('auditType')?.markAsTouched();
  //     alert("Please select audit type");
  //     return;
  //   }

  // const res = [
  //   { claimId: 101, customerName: 'Alice', amount: 5000, status: 'Approved' },
  //   { claimId: 102, customerName: 'Bob', amount: 3000, status: 'Pending' },
  //   { claimId: 103, customerName: 'Charlie', amount: 4500, status: 'Rejected' }
  // ];

  // const transformedData = res.map((item: any) => {

  //   const newItem: any = {};

  //   Object.keys(item).forEach(key => {

  //     newItem[key.toUpperCase()] = item[key];

  //   });

  //   return newItem;

  // });

  // // Build CSV content
  // const headers = Object.keys(transformedData[0]).join(",");

  // const rows = transformedData.map((row: any) =>
  //   Object.values(row).join(",")
  // );

  // const csvContent = [headers, ...rows].join("\n");

  // // Create Blob and download file
  // const blob = new Blob(
  //   [csvContent],
  //   { type: 'text/csv;charset=utf-8;' }
  // );

  // FileSaver.saveAs(blob, 'DownloadClaimUploadExcel.csv');

  UploadFile(event: any) {
    this.isFileUploaded = false;
    this.FileUploadedData = [];
    const file = event.target.files[0];

    if (!file) {
      return;
    }
    this.uploadedFileName = file.name;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      // Convert sheet to JSON array
      const jsonDataF = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: '',
      }) as any[][];

      console.log('Excel Raw Data', jsonDataF);
      if (jsonDataF.length === 0) {
        this.openModal('Error', 'Excel file is empty', 'error');
        return;
      }
      // Headers
      const headers = jsonDataF[0];
      // Rows
      const rows = jsonDataF.slice(1);
      // Convert rows into objects
      this.FileUploadedData = rows
        .map((row: any[]) => {
          const obj: any = {};
          headers.forEach((key: string, index: number) => {
            obj[key] = row[index];
          });
          return obj;
        })
        .filter((obj: any) => {
          return Object.values(obj).some((val) => val !== null && val !== undefined && val !== '');
        });
      // this.openModal(
      //   'Success',
      //   'Excel file uploaded successfully',
      //   'success'
      // );
    };
    reader.readAsArrayBuffer(file);

    this.auditService
      .UploadAuditFile(file, this.auditClaimUpload.get('auditType')?.value)
      .subscribe({
        next: (res) => {
          console.log('Upload File response', res);
          this.uploadFileFullPath = res.fullPath;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  ProcessUploadData() {
    if (!this.uploadFileFullPath || !this.auditClaimUpload.get('auditType')?.value) {
      this.openModal(
        'Validation',
        'Kindly select the audit type and upload the Excel file.',
        'warning',
      );
      return;
    }
    if (!this.auditClaimUpload.get('fromDate')?.value) {
      this.openModal('Validation', 'Kindly select the audit date.', 'warning');
      return;
    }
    const auditDate = this.formatDate(this.auditClaimUpload.get('fromDate')?.value);
    this.auditService
      .ProcessUploadData(
        this.uploadFileFullPath,
        this.auditClaimUpload.get('auditType')?.value,
        auditDate,
      )
      .subscribe({
        next: (res) => {
          console.log('UploadProcess result', res);
          if (res.status == 'Success') {
            this.resetForm();
            this.openModal('Success', res.data || 'Data uploaded successfully.', 'success');
          } else {
            this.openModal('Success', res.data || 'Data uploaded Failed.', 'success');
          }
        },
        error: (err) => {
          console.error('Upload Error', err);

          this.openModal('Error', err?.error?.message || 'Failed to upload data.', 'error');
        },
      });
  }

  saveStatus(){
    if (!this.status) {
      this.alertservice.show('warning', "Please select a status")
    return;
  }

  if(this.selectedIds.length == 0){
    this.alertservice.show('warning', "Please select atleast one data to start process.")
    return;
  }
    this.auditService.SaveStatus(this.status, this.selectedIds).subscribe({
      next: res =>{
        console.log("Saved successfully", res);
      },
      error : err =>{
        console.error("some error while saving data.", err);
        
      }
    })
  }

  rejectStatus(){
    if(!this.rejectReason){
      this.alertservice.show('warning', "Reject reason is mandetory")
      return;
    }

    if(this.selectedIds.length == 0){
    this.alertservice.show('warning', "Please select atleast one data to start process.")
    return;
  }

  this.auditService.RejectStatus(this.rejectReason, this.selectedIds).subscribe({
    next: res =>{
    },
    error: err =>{
      
    }
  })

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
      maxDate: 0
    });
    $('.calendar-icon').on('click', (event: any) => {
      $(event.currentTarget)
        .siblings('input.datepicker')
        .datepicker('show');
    });
  }
}
