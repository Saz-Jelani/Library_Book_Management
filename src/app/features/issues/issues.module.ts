import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { IssueManagementComponent } from './issue-management.component';
const routes: Routes = [{ path: '', component: IssueManagementComponent }];
@NgModule({ declarations: [IssueManagementComponent], imports: [SharedModule, RouterModule.forChild(routes)] })
export class IssuesModule {}
