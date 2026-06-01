import { Component, signal, Signal } from '@angular/core';
import { RouteLoaderService } from '../../services/routeLoader/route-loader';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-route-loader',
  standalone: false,
  templateUrl: './route-loader.html',
  styleUrl: './route-loader.css',
})
export class RouteLoader {
  loading$!: Observable<boolean>;
  progress$! : Observable<number>;
  constructor(
    private routeLoader: RouteLoaderService
  ) { 
  }

  ngOnInit(): void {
    this.loading$ = this.routeLoader.loading$;
    this.progress$ = this.routeLoader.progress$
  }
}
