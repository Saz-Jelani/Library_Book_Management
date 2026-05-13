import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { BookCatalogComponent } from './book-catalog.component';
import { BookDetailsComponent } from './book-details.component';

const routes: Routes = [{ path: '', component: BookCatalogComponent }];
@NgModule({ declarations: [BookCatalogComponent, BookDetailsComponent], imports: [SharedModule, RouterModule.forChild(routes)] })
export class CatalogModule {}
