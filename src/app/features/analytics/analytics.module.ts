import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { SharedModule } from '../../shared/shared.module';
import { AnalyticsDashboardComponent } from './analytics-dashboard.component';
const routes: Routes = [{ path: '', component: AnalyticsDashboardComponent }];
@NgModule({ declarations: [AnalyticsDashboardComponent], imports: [SharedModule, NgChartsModule, RouterModule.forChild(routes)] })
export class AnalyticsModule {}
