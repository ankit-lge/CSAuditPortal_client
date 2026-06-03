import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouteLoaderService {
   private loadingSubject = new BehaviorSubject(false);
  private progressSubject = new BehaviorSubject<number>(0);
  loading$ = this.loadingSubject.asObservable();
  progress$ = this.progressSubject.asObservable();

  show() {
    this.loadingSubject.next(true);
    this.progressSubject.next(10);

  const interval = setInterval(() => {

    const current =
      this.progressSubject.value;

    if (current < 90) {

      this.progressSubject.next(
        current + 10
      );
    }

  }, 150);
  }

  hide() {
    this.progressSubject.next(100);

  setTimeout(() => {

    this.loadingSubject.next(false);

    this.progressSubject.next(0);

  }, 300);
  }
}
