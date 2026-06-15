import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})

export class EvaluationProcessService{
    private readonly baseUrl = environment.apiUrl;
    private readonly http = inject(HttpClient);

    getEvaluationProcessData(receiptNo: string, auditTypeId: number){
        return this.http.get<any>(`${this.baseUrl}EvaluationProcess/Get_Evaluation_Process_Data?receiptNo=${receiptNo}&audit_typeId=${auditTypeId}`)
    }
}