import { Component, inject, Input } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth-service';

@Component({
  selector: 'app-nav-bar',
  standalone: false,
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar {
  @Input() isCollapsed = false;
  auditOpen = true;

  navbarMenu : any = [];

  private user = inject(AuthService);

  ngOnInit(){
    this.assignUserRole()
  }

  private async assignUserRole (){
    const role = await this.user.getUserRole()
    if(role == "Admin"){
      this.navbarMenu = [
        {
          path : "/audit-claim-upload",
          name : "Audit Claim Upload"
        },
        {
          path : "/review",
          name : "Review Process"
        },
        {
          path : "/feedback-status-report",
          name : "Feedback Status Report"
        },
        {
          path : "/audit-summary-report",
          name : "Audit Summary Report"
        }
      ]
    }
    else if (role == "HO"){
      this.navbarMenu = [
        {
          path : "/audit-claim-upload",
          name : "Audit Claim Upload"
        }
      ]
    }
    else if (role == "ESC"){
      this.navbarMenu = [
         {
          path : "/review",
          name : "Review Process"
        }
      ]
    } 
    else if (role == "Branch"){
      this.navbarMenu = [
        {
          path : "/review",
          name : "Review Process"
        },
        {
          path : "/feedback-status-report",
          name : "Feedback Status Report"
        },
        {
          path : "/audit-summary-report",
          name : "Audit Summary Report"
        }
      ]
    }
  }
}
