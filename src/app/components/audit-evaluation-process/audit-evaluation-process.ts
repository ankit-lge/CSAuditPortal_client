import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluationProcessService } from '../../services/evaluation_process.service';
import { EvaluationProcessData } from '../../core/interfaces/evaluation-process-data';

@Component({
  selector: 'app-audit-evaluation-process',
  standalone: false,
  templateUrl: './audit-evaluation-process.html',
  styleUrls: ['./audit-evaluation-process.css']
})
export class AuditEvaluationProcess {
  private readonly route = inject(ActivatedRoute);
  private readonly ev_service = inject(EvaluationProcessService);
  evaluationData !: EvaluationProcessData;
  ngOnInit(){
    this.route.queryParams.subscribe(params =>{
      const gsfsNo = params['gsfsNo']
      const auditTypeId = params['auditType']
      if(gsfsNo && auditTypeId){
        this.ev_service.getEvaluationProcessData(gsfsNo, auditTypeId).subscribe({
          next: res =>{
            console.log(res)
            this.evaluationData = res.data;
          },
          error : err =>{
            console.error(err);
            
          }
        })
      }
    });
  }


}
