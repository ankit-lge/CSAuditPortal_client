import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AuditService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAuditDropdown(): Observable<any[]> {
    // return this.http.get<any[]>(this.apiUrl);
    return this.http.get<any[]>(`${this.apiUrl}Audit/GetAuditDropdownList`);
  }

  uploadData(data: any, templateId: any) {
    // let tempUSer = JSON.stringify(localStorage.getItem("user"));
    // let user = JSON.parse(JSON.parse(tempUSer));
    const payload = {
      records: data,
    };
    console.log('upload data payload:', payload);
    return this.http
      .post<any>(`${this.apiUrl}Audit/upload?templateId=${templateId}`, payload)
      .pipe(catchError(this.handleError));
  }

  UploadAuditFile(file: File, auditType: any) {
    let formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('auditType', auditType);
    return this.http
      .post<any>(`${this.apiUrl}FileUpload/UploadAudittemplate`, formData)
      .pipe(catchError(this.handleError));
  }

  ProcessUploadData(filePath: any, audityType: any, auditDate: any) {
    return this.http.post<any>(
      `${this.apiUrl}Audit/ProcessUploadData?fullPath=${encodeURIComponent(filePath)}&auditType=${audityType}&auditDate=${auditDate}`,
      {},
    );
  }


  verifyUploadedExcelData(sessionId: string, templateId: string) {
    return this.http.get<any>(`${this.apiUrl}Audit/verify-upload?sessionId=${sessionId}&templateId=${templateId}`)
  }

  SaveStatus(status: string, selectedIds: number[]) {
    return this.http.post(`${this.apiUrl}Audit/save-status`, {
      status,
      selectedIds
    });
  }

  RejectStatus(reason: string, selectedIds: number[]) {
    return this.http.post(`${this.apiUrl}Audit/reject-status`, {
      reason,
      selectedIds
    })
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
