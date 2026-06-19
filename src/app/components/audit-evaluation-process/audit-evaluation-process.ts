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

  private gsfsNo: string | null = null;
  // private auditTypeId: string | null = null;
   private auditTypeId: number | null= null;
  evaluationData !: EvaluationProcessData;

  saveESCLGCForm!: FormGroup;
  saveHOForm !: FormGroup;

  esc_lgcFeedbackDetails!: FeedbackDetail[];
  hoFeedBackDetails !: FeedbackDetail[];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const gsfsNo = params['gsfsNo']
      const auditTypeId = params['auditType']
      if (gsfsNo && auditTypeId) {
        this.gsfsNo = gsfsNo;
        this.auditTypeId = auditTypeId;
        this.getDataOnPlageLoad();
      }
    });

    this.saveESCLGCForm = this._fb.group({
      remark: ['', Validators.required],
      status: ['', Validators.required]
    })

    this.saveHOForm = this._fb.group({
      remark: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  getDataOnPlageLoad() {
    this.ev_service.getEvaluationProcessData(this.gsfsNo!, this.auditTypeId!).subscribe({
      next: res => {
        const reviewData = res.data;
        this.evaluationData = res.data;

        this.esc_lgcFeedbackDetails = JSON.parse(reviewData['ESC/LGC_CLAIM_DETAILS']);
        this.hoFeedBackDetails = JSON.parse(reviewData.HO_FEEDBACK_DETAILS);
      },
      error: err => {
        console.error(err);
        this.alert.show("error", "Internal issue found. Please try after sometime.")
      }
    })
  }



  saveESC_LGC_Feedback() {
    if (this.saveESCLGCForm.invalid) {
      this.saveESCLGCForm.markAsUntouched();
      return;
    }

    const data = this.saveESCLGCForm.value;
    const payload = {
      gsfS_ReceiptNo: this.gsfsNo,
      auditTypeId: this.auditTypeId,
      status: data.status,
      remark: data.remark,
      actionBy: "ESC/LGC"
    }

    this.saveData(payload);
  }

  save_HO_Feedback() {
    if (this.saveHOForm.invalid) {
      this.saveHOForm.markAsUntouched();
      return;
    }

    const data = this.saveHOForm.value;
    const payload = {
      gsfS_ReceiptNo: this.gsfsNo,
      auditTypeId: this.auditTypeId,
      status: data.status,
      remark: data.remark,
      actionBy: "HO"
    }
    this.saveData(payload);
  }



  private saveData(payload: any) {
    this.ev_service.updateFeedback(payload).subscribe({
      next: (res: any) => {
        this.getDataOnPlageLoad();
        this.alert.show("success", "Success")
      },
      error: (err: any) => {
        this.alert.show("error", "Internal issue occured. Please try after sometime.")
      }
    })
  }
}
