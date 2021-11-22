import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserResolver } from 'src/app/resolvers/user.resolver';
import { UsersComponent } from './users.component';

const routes: Routes = [
  { path: '', component: UsersComponent },
  {
    path: 'edit/:id',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule),
    resolve: { user: UserResolver },
  },
  {
    path: 'create',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
