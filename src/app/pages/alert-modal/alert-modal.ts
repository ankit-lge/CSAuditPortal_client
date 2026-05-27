import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-alert-modal',
  standalone: false,
  templateUrl: './alert-modal.html',
  styleUrl: './alert-modal.css',
})
export class AlertModal {
  @Input() type: 'success' | 'error' | 'warning' = 'success';
  @Input() message: string = '';
  @Input() isOpen: boolean = false;

  @Output() close = new EventEmitter<void>();

  get headerText(): string {
    switch (this.type) {
      case 'success': return 'Success';
      case 'error': return 'Error';
      case 'warning': return 'Warning';
      default: return '';
    }
  }

  onClose() {
    this.close.emit();
  }

}
