import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Branch } from '../core/interfaces/branch-data';

@Injectable({
  providedIn: 'root'
})

export class ReportService {

  private readonly baseUrl = environment.apiUrl;

  private readonly http = inject(HttpClient);
 

  getBranches(): Observable<Branch[]> {
  return this.http.get<Branch[]>(
    `${this.baseUrl}Report/branches`
  );
}
  searchfeedbackreport(payload: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}Report/SearchFeedbackStatus`,
      payload
    );
  }

  downloadFeedbackReport(payload: any){
    return this.http.post(
      `${this.baseUrl}Report/DownloadFeedbackReport`,
      payload,
      {
        responseType: 'blob',
        observe: 'response'
      }
    );
  }
  searchSummaryReport(payload: any) {
  return this.http.post(
    `${this.baseUrl}Report/SearchSummaryStatus`,
    payload
  );
}

downloadSummaryReport(payload: any){
  return this.http.post(
    `${this.baseUrl}Report/DownloadSummaryStatusReport`,
    payload,
    {
      responseType: 'blob',
      observe: 'response'
    }
  );
}
}
    