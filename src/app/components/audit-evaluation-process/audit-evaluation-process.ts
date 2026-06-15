import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { EvaluationProcessService } from '../../services/evaluation_process.service';

@Component({
  selector: 'app-audit-evaluation-process',
  standalone: false,
  templateUrl: './audit-evaluation-process.html',
  styleUrl: './audit-evaluation-process.css',
})
export class AuditEvaluationProcess {
  private readonly route = inject(Router);
  private readonly ev_service = inject(EvaluationProcessService);

  ngOnInit(){
    this.route;
  }
}
