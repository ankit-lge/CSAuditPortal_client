import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluationProcessService } from '../../services/evaluation_process.service';
import { EvaluationProcessData, FeedbackDetail } from '../../core/interfaces/evaluation-process-data';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../services/alert-service';

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
  private readonly alert = inject(AlertService);

  private gsfsNo : string = "";
  private auditTypeId: number = 0;

  selectedAttachement!: File;

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
        this.gsfsNo = gsfsNo;
        this.auditTypeId = auditTypeId;
        this.loadAuditEvaluation();
      }
    });

    this.saveESCLGCForm = this._fb.group({
      remark : ['', Validators.required],
      status: ['',Validators.required],
      attachment: [null]
    })

    this.saveHOForm = this._fb.group({
      remark : ['', Validators.required],
      status: ['',Validators.required],
      attachment: [null]
    });
  }

  selectAttachement(event:any):void{
    const file = event.target.files?.[0];
    if(file){
      this.selectedAttachement = file;
      this.saveHOForm.patchValue({attachment : file.name})
    }
  }

  saveESC_LGC_Feedback(){
    if(this.saveESCLGCForm.invalid){
      this.saveESCLGCForm.markAsUntouched();
      return;
    }

    const data = this.saveESCLGCForm.value;

    const payload = new FormData();
    payload.append("gsfS_ReceiptNo", this.gsfsNo);
    payload.append("auditTypeId", this.auditTypeId.toString());
    payload.append("status", data.status);
    payload.append("remark", data.remark);
    payload.append("Attachement", this.selectedAttachement);
    payload.append("actionBy", "ESC/LGC");
   
    this.saveData(payload);
  }

  save_HO_Feedback(){
    if(this.saveHOForm.invalid){
      this.saveHOForm.markAsUntouched();
      return;
    }
    const data = this.saveHOForm.value;
    const payload = new FormData();

    payload.append("gsfS_ReceiptNo", this.gsfsNo);
    payload.append("auditTypeId", this.auditTypeId.toString());
    payload.append("status", data.status);
    payload.append("remark", data.remark);
    payload.append("Attachement", this.selectedAttachement);
    payload.append("actionBy", "HO");
   
    this.saveData(payload);
  }

  private loadAuditEvaluation(){
    this.ev_service.getEvaluationProcessData(this.gsfsNo, this.auditTypeId).subscribe({
          next: res =>{
            const reviewData = res.data;
            this.evaluationData = res.data;
            this.esc_lgcFeedbackDetails = JSON.parse(reviewData.ESC_LGC_CLAIM_DETAILS);
            this.hoFeedBackDetails = JSON.parse(reviewData.HO_FEEDBACK_DETAILS);
          },
          error : err =>{
            console.error(err);
            this.alert.show("error", "Internal issue found. Please try after sometime.")
          }
        })
  }


  private saveData(payload:any){
    this.ev_service.updateFeedback(payload).subscribe({
      next: (res: any) =>{
        this.alert.show("success", res.response)
        this.loadAuditEvaluation();
      },
      error: (err: any) =>{
        this.alert.show("error", "Internal issue occured. Please try after sometime.")
      }
    })
  }
}
