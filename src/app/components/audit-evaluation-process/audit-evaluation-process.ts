import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluationProcessService } from '../../services/evaluation_process.service';
import { EvaluationProcessData, FeedbackDetail } from '../../core/interfaces/evaluation-process-data';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-audit-evaluation-process',
  standalone: false,
  templateUrl: './audit-evaluation-process.html',
  styleUrls: ['./audit-evaluation-process.css']
})
export class AuditEvaluationProcess {
  private readonly route = inject(ActivatedRoute);
  private readonly ev_service = inject(EvaluationProcessService);
  private readonly _fb = inject(FormBuilder);
  evaluationData !: EvaluationProcessData;

  saveESCLGCForm!: FormGroup;
  saveHOForm !: FormGroup;

  esc_lgcFeedbackDetails!: FeedbackDetail[];
  hoFeedBackDetails !: FeedbackDetail[];

  ngOnInit(){
    this.route.queryParams.subscribe(params =>{
      const gsfsNo = params['gsfsNo']
      const auditTypeId = params['auditType']
      if(gsfsNo && auditTypeId){
        this.ev_service.getEvaluationProcessData(gsfsNo, auditTypeId).subscribe({
          next: res =>{
            const reviewData = res.data;
            this.evaluationData = res.data;

            this.esc_lgcFeedbackDetails = JSON.parse(reviewData['ESC/LGC_CLAIM_DETAILS']);
            this.hoFeedBackDetails = JSON.parse(reviewData.HO_FEEDBACK_DETAILS);
          },
          error : err =>{
            console.error(err);
            
          }
        })
      }
    });

    this.saveESCLGCForm = this._fb.group({
      remark : [Validators.required],
      status: [Validators.required]
    })

    this.saveHOForm = this._fb.group({
      remark : [Validators.required],
      status: [Validators.required]
    });
  }


  saveESC_LGC_Feedback(){

  }

}
