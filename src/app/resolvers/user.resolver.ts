import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { IUser } from '../interfaces/user';
import { UsersService } from '../services/users.service';

@Injectable({
  providedIn: 'root',
})
export class UserResolver implements Resolve<IUser> {
  constructor(private usersService: UsersService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUser> {
    return this.usersService.getUser(route.params['id']);
  }
}
