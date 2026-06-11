import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-feedback-status',
  standalone: false,
  templateUrl: './feedback-status.html',
  styleUrl: './feedback-status.css',
})
export class FeedbackStatus implements OnInit, OnDestroy {

  @ViewChild('pickerContainer') pickerContainer!: ElementRef;

  displayValue: string = '';
  nativeValue: string = '';
  selectedMonth: number | null = null;
  selectedYear: number | null = null;
  pickerYear: number = new Date().getFullYear();
  isPickerOpen: boolean = false;

  readonly months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  readonly today = new Date();
  readonly currentYear = this.today.getFullYear();
  readonly startYear = this.currentYear - 10;

  private clickListener!: () => void;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.clickListener = this.renderer.listen('document', 'click', (event: Event) => {
      const container = this.pickerContainer?.nativeElement;
      if (container && !container.contains(event.target as Node)) {
        this.isPickerOpen = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
  }

  togglePicker(): void {
    this.isPickerOpen = !this.isPickerOpen;
    if (this.isPickerOpen) {
      this.pickerYear = this.selectedYear ?? this.currentYear;
    }
  }

  changeYear(dir: number): void {
    const next = this.pickerYear + dir;
    if (next >= this.startYear && next <= this.currentYear) {
      this.pickerYear = next;
    }
  }

  isFutureMonth(monthIndex: number): boolean {
    return (
      this.pickerYear > this.currentYear ||
      (this.pickerYear === this.currentYear && monthIndex > this.today.getMonth())
    );
  }

  isSelected(monthIndex: number): boolean {
    return this.selectedYear === this.pickerYear && this.selectedMonth === monthIndex;
  }

  selectMonth(monthIndex: number): void {
    this.selectedMonth = monthIndex;
    this.selectedYear = this.pickerYear;

    const monthName = new Date(this.pickerYear, monthIndex)
      .toLocaleString('default', { month: 'long' });
    this.displayValue = `${monthName} ${this.pickerYear}`;

    const mm = String(monthIndex + 1).padStart(2, '0');
    this.nativeValue = `${this.pickerYear}-${mm}-01`;

    this.isPickerOpen = false;
  }

  resetForm(): void {
    this.displayValue = '';
    this.nativeValue = '';
    this.selectedMonth = null;
    this.selectedYear = null;
    this.isPickerOpen = false;
  }
}