import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlertService {

  private alertSubject = new Subject<any>();
  alertState$ = this.alertSubject.asObservable();

  show(type: string, message: string) {
    this.alertSubject.next({
      type,
      message,
      isOpen: true
    });
  }

  close() {
    this.alertSubject.next({
      isOpen: false
    });
  }
}
