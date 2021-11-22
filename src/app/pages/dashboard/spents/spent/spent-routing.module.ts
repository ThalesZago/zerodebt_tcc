import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpentComponent } from './spent.component';

const routes: Routes = [{ path: '', component: SpentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpentRoutingModule {}
