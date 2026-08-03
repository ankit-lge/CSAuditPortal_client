import { Component, EventEmitter, HostListener, Output, signal } from '@angular/core';
import { AlertService } from '../../services/alert-service';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { RouteLoaderService } from '../../core/services/routeLoader/route-loader';
import { AuthService } from '../../core/services/auth/auth-service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
protected readonly title = signal('CallAuditPortal');
  isCollapsed  = signal(false);
  isMobile = signal(false);
  constructor(private alertService: AlertService,
    private router: Router,
    private routeLoader: RouteLoaderService,
    private authService: AuthService
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

    this.checkScreenSize();
  }

   @HostListener('window:resize')
onResize() {

  this.checkScreenSize();
}
  
  handleSidebar(value: boolean){
    this.isCollapsed.set(value);
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

logout(){
  this.authService.logOut().subscribe({
    next : (res:any) =>{
      this.alertService.show("success", res.message);
      this.router.navigate(["/landing"])
    },
    error : (err : any) =>{
      console.error(err);
    }
  })
}
}
