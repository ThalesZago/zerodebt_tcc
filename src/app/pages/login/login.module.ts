import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalRecoveryComponent } from 'src/app/components/modal-recovery/modal-recovery.component';
import { MaterialModule } from '../../shared/material.module';
import { SharedModule } from '../../shared/shared.module';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

@NgModule({
  declarations: [LoginComponent, ModalRecoveryComponent],
  imports: [CommonModule, LoginRoutingModule, MaterialModule, SharedModule],
})
export class LoginModule {}
