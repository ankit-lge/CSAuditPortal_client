import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuditService } from '../../../services/audit.service';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-landing-page',
  standalone: false,
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {
  userId: any;
  password: any;
  alertService: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private auditService: AuditService) {
    // this.userId = this.route.snapshot.paramMap.get('userId');
    // this.password = this.route.snapshot.paramMap.get('password');
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'];
      this.password = params['password'];
    });
    // alert(this.userId);
    // alert(this.password);
    if (this.userId != '' && this.password != '') {
      localStorage.clear();

      
      // login api call and on sucess redirect to the defualt page which is "audit-claim-upload"

      this.auditService.loginProcessOnRedirection(this.userId, this.password).subscribe({
        next: (res) => {
          //  set the login response in the localStorage (for userDetails, authToken, refreshToken)
          localStorage.setItem('userdata', JSON.stringify(res));
          this.router.navigate(['audit-claim-upload']);
        },
        error: (err) => {
          localStorage.clear();
          this.alertService.show(
        'Authentication Failed',
        'Unable to authenticate your account. You will be redirected to the Mail Application login page.',
        () => {
          // window.location.href = environment.mailApplicationUrl; // or your login URL
        }
      );
          // show the error msg using model popup and redirect to the main applicaiton url loging page.
           localStorage.clear();

  this.alertService.show(
    'Login Required',
    'Please log in to the Mail Application to continue.',
    () => {
      // window.location.href = environment.mailApplicationUrl; // or your login URL
    }
  );
        }
      })
    }
    else{
       localStorage.clear();

  this.alertService.show(
    'Login Required',
    'Please log in to the Mail Application to continue.',
    () => {
      window.location.href = 'https://your-mail-application-url/login';
    }
  );
      
    }
  }
}
