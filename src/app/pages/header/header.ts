import { Component, EventEmitter, HostListener, Output, signal } from '@angular/core';
import { AlertService } from '../../services/alert-service';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { RouteLoaderService } from '../../core/services/routeLoader/route-loader';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
protected readonly title = signal('CallAuditPortal');
  modalType: any;
  modalMessage: string = '';
  isModalOpen: boolean = false;
  isCollapsed  = signal(false);
  isMobile = signal(false);
  constructor(private alertService: AlertService,
    private router: Router,
    private routeLoader: RouteLoaderService
  ) {

  }
  @Output() toggle = new EventEmitter<boolean>();
  isSidebarCollapsed = false;
  toggleSideBar(){
     this.isSidebarCollapsed = !this.isSidebarCollapsed;

  this.toggle.emit(this.isSidebarCollapsed);
  }
  
    ngOnInit() {
this.router.events.subscribe(event => {
  if (event instanceof NavigationStart) {

    console.log("loader called.");
      
      this.routeLoader.show();
  }

  if (
    event instanceof NavigationEnd ||
    event instanceof NavigationCancel ||
    event instanceof NavigationError
  ) {
 this.routeLoader.hide();
  }
});
    this.alertService.alertState$.subscribe(res => {
      this.modalType = res.type;
      this.modalMessage = res.message;
      this.isModalOpen = res.isOpen;
    });

    this.checkScreenSize();
  }

   @HostListener('window:resize')
onResize() {

  this.checkScreenSize();
}
  
  handleSidebar(value: boolean){
    this.isCollapsed.set(value);
  }
  handleModalClose() {
    this.isModalOpen = false;
  }

    checkScreenSize() {

  const width = window.innerWidth;

  // Mobile
  if (width < 768) {
     this.isMobile.set(true);
    this.isCollapsed.set(true);

  }

  // Tablet
  else if (width < 1200) {
    this.isMobile.set(false)
    this.isCollapsed.set(true);

  }

  // Desktop
  else {
    this.isMobile.set(false)
    this.isCollapsed.set(false);

  }

}
}
