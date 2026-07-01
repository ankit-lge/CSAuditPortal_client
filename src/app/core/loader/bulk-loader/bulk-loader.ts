import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-bulk-loader',
  standalone: false,
  templateUrl: './bulk-loader.html',
  styleUrl: './bulk-loader.css',
})
export class BulkLoader {
  @Input() progress = 0;
  @Input() message = 'Processing records...';
}
