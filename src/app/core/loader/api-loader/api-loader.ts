import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiLoaderService } from '../../services/apiLoader/api-loader-service';

@Component({
  selector: 'app-api-loader',
  standalone: false,
  templateUrl: './api-loader.html',
  styleUrl: './api-loader.css',
})
export class ApiLoader {
  loading$! : Observable<boolean>;

  constructor(private apiloader: ApiLoaderService){
  } 

  ngOnInit(){
    this.loading$ = this.apiloader.loading$;
  }
}
