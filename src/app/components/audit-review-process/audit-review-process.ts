import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReviewProcessService } from '../../services/review-process.service';
import { Observable } from 'rxjs';
import { AuditService } from '../../services/audit.service';
import { AlertService } from '../../services/alert-service';
import { ReviewProcessData } from '../../core/interfaces/review-process-data';
declare var $: any;

@Component({
  selector: 'app-audit-review-process',
  standalone: false,
  templateUrl: './audit-review-process.html',
  styleUrl: './audit-review-process.css',
})
export class AuditReviewProcess {

  private readonly fb = inject(FormBuilder);
  private readonly reviewSearvice = inject(ReviewProcessService);
  private readonly auditService = inject(AuditService);
  private readonly alertService = inject(AlertService);
  Math = Math;
  searchedData: ReviewProcessData[] = [];
  filteredData: ReviewProcessData[] = [];
  auditTypes$!: AuditType[];
  searchingForm!: FormGroup;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  currentPage: number = 1;
  totalPages: number = 0;
  searchText: string = '';
  ngOnInit(){
    this.searchingForm = this.fb.group({
      receiptNo : ['', Validators.required],
      suspicious : ['', Validators.required],
      auditType: ['', Validators.required],
      fromAuditDate: ['', Validators.required],
      toAuditDate: ['', Validators.required]
    });

    this.auditService.getAuditDropdown().subscribe({
      next: (res:any) =>{
        this.auditTypes$ = res;
      }
    });
  }

  searchReviewProcess(){
    if(this.searchingForm.invalid){
      this.searchingForm.markAllAsTouched();
      return;
    }

    this.loadData(1);
  }

  loadData(pageNumber: number){
    const data = this.searchingForm.value;
    const payload = {
      receiptNo : data.receiptNo,
      suspicious: data.suspicious,
      auditTypeId: data.auditType,
      fromAuditDate: data.fromAuditDate.replace(/\//g, ''),
      toAuditDate: data.toAuditDate.replace(/\//g, ''),
      pageNumber : pageNumber,
      pageSize : this.pageSize
    }

    this.reviewSearvice.searchReviewProces(payload).subscribe({
      next: (res:any) =>{
        if(res.success){
          this.searchedData = res.data;
          this.filteredData = [...res.data]
          this.totalRecords = res.totalData;
          this.currentPage = pageNumber;
          this.totalPages = Math.ceil(
            this.totalRecords / this.pageSize
          );


          console.log("Filtered DAta", this.filteredData);
          console.log("Search Data", this.searchedData);
          
          
        }
      }
    });
  }

  onSearch(){
  const search = this.searchText.trim().toLowerCase();
  if (!search) {
    this.filteredData = [...this.searchedData];
    return;
  }

  this.filteredData = this.searchedData.filter(item =>
    Object.values(item).some(value =>
      String(value ?? '')
        .toLowerCase()
        .includes(search)
    )
  );
}

  onDownload(){
    const data = this.searchingForm.value;
    const payload = {
      receiptNo : data.receiptNo,
      suspicious: data.suspicious,
      auditTypeId: data.auditType,
      fromAuditDate: data.fromAuditDate.replace(/\//g, ''),
      toAuditDate: data.toAuditDate.replace(/\//g, '')
    }

    this.reviewSearvice.downloadData(payload).subscribe({
      next : (res : Blob)=>{
        const blob = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `AuditReport_${new Date().getTime()}.xlsx`;
        link.click();

        window.URL.revokeObjectURL(url);

        this.alertService.show('success', 'Excel downloaded successfully.');
      }
    });
  }

  onReset(){
    this.searchingForm.reset();
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
          this.searchingForm.get(controlName)?.setValue(dateText);
        }
      },
    });
    $('.calendar-icon').on('click', (event: any) => {
      $(event.currentTarget).siblings('input.datepicker').datepicker('show');
    });
  }
}
