import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { ModalConfirmComponent } from 'src/app/components/modal-confirm/modal-confirm.component';
import { ModalImageComponent } from 'src/app/components/modal-image/modal-image.component';
import { ModalLogoutComponent } from 'src/app/components/modal-logout/modal-logout.component';
import { SideNavComponent } from 'src/app/components/sidenav/sidenav.component';
import { ToolbarComponent } from 'src/app/components/toolbar/toolbar.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  declarations: [
    DashboardComponent,
    SideNavComponent,
    ToolbarComponent,
    ModalConfirmComponent,
    ModalImageComponent,
    ModalLogoutComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    MaterialModule,
    ChartsModule,
  ],
})
export class DashboardModule {}
