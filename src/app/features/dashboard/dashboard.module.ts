import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { DashboardHomeComponent } from './dashboard-home.component';
const routes: Routes = [{ path: '', component: DashboardHomeComponent }];
@NgModule({ declarations: [DashboardHomeComponent], imports: [SharedModule, RouterModule.forChild(routes)] })
export class DashboardModule {}
