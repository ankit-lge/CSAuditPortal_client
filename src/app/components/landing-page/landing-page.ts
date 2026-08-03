import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth-service';
import { AlertService } from '../../services/alert-service';

@Component({
  selector: 'app-landing-page',
  standalone: false,
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {
  private router = inject(Router);
  private activeRoute = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private alertService = inject(AlertService);

  ngOnInit(){
    this.activeRoute.queryParams.subscribe((param) =>{
      const param1 = param["param1"];
      const param2 = param["param2"];

      if(!param1 || param1 == null || param1 == "" || !param2 || param2 == null || param2 == ""){
        location.href = "http://10.101.0.161:8888/CsnetPlus/loginForm"
      }
      else{
        this.authService.authorise(param1, param2).subscribe({
        next: (res:any) =>{
          this.alertService.show("success", res?.message)
          this.router.navigate(['/audit-claim-upload']);
        },
        error: (err) =>{
          console.error("Login Error", err);
        }
      })
      }
      
    })
  }
}
