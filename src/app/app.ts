import { Component, HostListener, signal } from '@angular/core';
import { AlertService } from './services/alert-service';
import {
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  Router
} from '@angular/router';
import { RouteLoaderService } from './core/services/routeLoader/route-loader';
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
  isMobile = signal(false);
  constructor(
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.alertService.alertState$.subscribe(res => {
      this.modalType = res.type;
      this.modalMessage = res.message;
      this.isModalOpen = res.isOpen;
    });
  }
  handleModalClose() {
    this.isModalOpen = false;
  }

}
