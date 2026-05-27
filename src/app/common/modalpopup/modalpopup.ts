import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modalpopup',
  standalone: false,

  templateUrl: './modalpopup.html',
  styleUrl: './modalpopup.css',
})
export class Modalpopup {
  @Input() showModal: boolean = false;
  @Input() message: string = '';
  @Input() title: string = '';
  @Input() type: string = ''; // success, error, warning

  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.showModal = false;
    this.close.emit();
  }
}
