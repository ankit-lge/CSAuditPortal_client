import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuditTypeLookup } from './audit-type-lookup/audit-type-lookup';
import { AuditTemplateLook } from './audit-template-look/audit-template-look';
import { ManageAuditTemplate } from './manage-audit-template/manage-audit-template';
import { ItLayout } from './it-layout/it-layout';

const routes: Routes = [
  {
    path : '',
    component : ItLayout,
    children : [
      {
        path : '',
        redirectTo : "audit-type",
        pathMatch : "full"
      },
      {
        path : "audit-type",
        component : AuditTypeLookup
      },
      {
        path : "audit-template",
        component : AuditTemplateLook
      },
      {
        path : "manage-audit-template",
        component : ManageAuditTemplate
      }
    ]
  }
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ITSectionRoutingModule {}
