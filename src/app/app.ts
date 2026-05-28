import { Component, signal } from '@angular/core';
import { AlertService } from './services/alert-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('CallAuditPortal');
  modalType: any;
  modalMessage: string = '';
  isModalOpen: boolean = false;
  isCollapsed  = signal(false);
  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.alertService.alertState$.subscribe(res => {
      this.modalType = res.type;
      this.modalMessage = res.message;
      this.isModalOpen = res.isOpen;
    });
  }

  
  handleSidebar(value: boolean){
    this.isCollapsed.set(value);
  }
  handleModalClose() {
    this.isModalOpen = false;
  }
}
