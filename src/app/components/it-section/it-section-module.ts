import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITSectionRoutingModule } from './it-section-routing-module';
import { AuditTypeLookup } from './audit-type-lookup/audit-type-lookup';
import { AuditTemplateLook } from './audit-template-look/audit-template-look';
import { ManageAuditTemplate } from './manage-audit-template/manage-audit-template';
import { ItLayout } from './it-layout/it-layout';

@NgModule({
  declarations: [AuditTypeLookup, AuditTemplateLook, ManageAuditTemplate, ItLayout],
  imports: [CommonModule, ITSectionRoutingModule],
})
export class ITSectionModule {}
