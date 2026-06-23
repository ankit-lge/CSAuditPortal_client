import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
// import { DownloadTemplateResponse } from './download-template-response';
@Injectable({
  providedIn: 'root',
})
export class AuditService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAuditDropdown(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}Audit/GetAuditDropdownList`);
  }

  downloadAuditTemplate(auditTypeId: number) {
    return this.http.post(`${this.apiUrl}Audit/DownloadTemplate?auditType=${auditTypeId}`, {}, {
      responseType: 'blob',
      observe: 'response'
    })
  }

  uploadData(data: any, templateId: any) {
    const payload = {
      records: data,
    };
    console.log('upload data payload:', payload);
    return this.http
      .post<any>(`${this.apiUrl}Audit/upload?templateId=${templateId}`, payload)
      .pipe(catchError(this.handleError));
  }

  // UploadAuditFile(file: File, auditType: any) {
  //   let formData = new FormData();
  //   formData.append('file', file, file.name);
  //   formData.append('auditType', auditType);
  //   return this.http
  //     .post<any>(`${this.apiUrl}FileUpload/UploadAudittemplate`, formData)
  //     .pipe(catchError(this.handleError));
  // }

  ProcessUploadData(payload: any) {
    return this.http.post<any>(
      `${this.apiUrl}Audit/ProcessUploadData`,
      payload
    );
  }

  verifyUploadedExcelData(sessionId: string, templateId: string) {
    return this.http.get<any>(`${this.apiUrl}Audit/verify-upload?sessionId=${sessionId}&templateId=${templateId}`)
  }

  searchAuditData(payload: any) {
    return this.http.post<any>(`${this.apiUrl}Audit/search-audit`, payload)
  }


  //  SearchAuditMoniter(payload: any){
  //   return this.http.post(`${this.apiUrl}AuditMonitoring/SearchAuditData`, payload);
  // }

  SaveStatus(payload: any) {
    return this.http.post(`${this.apiUrl}Audit/save-status`, payload);
  }


  DeleteUploadedData(payload: any) {
    return this.http.post(`${this.apiUrl}Audit/reject-status`, payload);
  }

  // Audit Monitoring Dashboard.
  RejectStatus(
    payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}AuditMonitoring/Reject`, payload
    );
  }

  submitToBranch(payload: any) {
    return this.http.post(`${this.apiUrl}AuditMonitoring/SubmitToBranch`, payload);
  }


  downloadExcel(request: any): Observable<Blob> {
    return this.http.post(
      `${this.apiUrl}AuditMonitoring/Download`,
      request,
      {
        responseType: 'blob'
      }
    );
  }

  // login api on the redirection
  loginProcessOnRedirection(UserId: any, Password: any) {
    let payload = {
      userId: UserId,
      password: Password
    }
    return this.http.post(`${this.apiUrl}AuditMonitoring/LoginProcessOnRedirection`, payload);
  }


  private handleError(error: HttpErrorResponse) {
    let errMsg: string;
    if (error.status === 0 || error.status === 400) {
      errMsg = error.error.message;
    } else if (error.status === 200) {
      errMsg = error.error.text;
    } else {
      errMsg = `${error.status} - ${error.statusText || ''} ${error.message}`;
    }
    return throwError(() => new Error(errMsg));
  }
}
