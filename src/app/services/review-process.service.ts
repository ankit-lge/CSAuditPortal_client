import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ReviewProcessService{

    private readonly baseUrl = environment.apiUrl;

    private readonly http = inject(HttpClient);

    searchReviewProces(payload: any){
       return this.http.post(`${this.baseUrl}ReviewProcess/Search`, payload);
    }

    downloadData(payload: any):Observable<Blob>{
        return this.http.post(
            `${this.baseUrl}ReviewProcess/Download`,
        payload,
    {
        responseType: 'blob'
    });
    }
}