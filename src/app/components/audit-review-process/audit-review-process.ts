import { Component } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-audit-review-process',
  standalone: false,
  templateUrl: './audit-review-process.html',
  styleUrl: './audit-review-process.css',
})
export class AuditReviewProcess {
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
