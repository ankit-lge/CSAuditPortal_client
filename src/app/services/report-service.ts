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
    `${environment.apiUrl}/branches`
  );
}
  searchfeedbackreport(payload: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}Report/SearchFeedbackStatus`,
      payload
    );
  }

  downloadData(payload: any): Observable<Blob> {
    return this.http.post(
      `${this.baseUrl}Report/DownloadFeedbackReport`,
      payload,
      {
        responseType: 'blob'
      }
    );
  }
  searchSummaryReport(payload: any) {
  return this.http.post(
    `${this.baseUrl}Report/SearchSummaryStatus`,
    payload
  );
}

downloadSummaryReport(payload: any): Observable<Blob> {
  return this.http.post(
    `${this.baseUrl}Report/DownloadSummaryStatusReport`,
    payload,
    {
      responseType: 'blob'
    }
  );
}
}
    