import {
  animate,
  animateChild,
  group,
  keyframes,
  query,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Module } from 'src/app/interfaces/module';
import { IUser } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { PermissionService } from 'src/app/services/permission.service';
import { SideNavService } from 'src/app/services/sidenav.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    trigger('appear', [
      transition(':enter', [
        animate(
          '250ms',
          keyframes([
            style({ opacity: 0, height: 0, offset: 0 }),
            style({ height: '30px', offset: 0.25 }),
            style({ height: '60px', offset: 0.5 }),
            style({ opacity: 0.75, height: '90px', offset: 0.75 }),
            style({ opacity: 1, height: 'auto', offset: 1 }),
          ]),
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms',
          keyframes([
            style({ opacity: 1, height: 'auto', offset: 0 }),
            style({ opacity: 0.25, height: '90px', offset: 0.25 }),
            style({ height: '60px', offset: 0.5 }),
            style({ height: '30px', offset: 0.75 }),
            style({ opacity: 0, height: 0, offset: 1 }),
          ]),
        ),
      ]),
    ]),

    trigger('slide', [
      state('true', style({ width: '300px' })),
      state('false', style({ width: '113px' })),
      transition('true <=> false', [
        group([query('@itemSlide', animateChild()), animate(200)]),
      ]),
    ]),

    trigger('itemSlide', [
      state('true', style({ opacity: 1, transform: 'translateX(0)' })),
      state('false', style({ opacity: 0, transform: 'translateX(-50%)' })),
      transition('true <=> false', animate('0.2s ease-out')),
    ]),

    trigger('contentSlide', [
      state('true', style({ marginLeft: '300px' })),
      state('false', style({ marginLeft: '113px' })),
      transition('true <=> false', animate(200)),
    ]),
  ],
})
export class SideNavComponent implements OnInit, OnDestroy {
  fullSized: boolean;
  hovered: boolean;
  aModules: Array<Module>;
  subscriptions$: Subscription[];
  user: IUser;
  toggleControl = new FormControl(false);
  @HostBinding('class') className = '';

  constructor(
    private sideNavService: SideNavService,
    private router: Router,
    private authService: AuthService,
    private permissionService: PermissionService,
    private overlayContainer: OverlayContainer,
  ) {
    this.fullSized = false;
    this.hovered = false;
    this.aModules = new Array<Module>();
    this.subscriptions$ = new Array<Subscription>();
    this.user = {} as IUser;
  }

  ngOnInit(): void {
    this.toggleControl.valueChanges.subscribe(darkMode => {
      const darkClassName = 'darkMode';
      this.className = darkMode ? darkClassName : '';
      if (darkMode) {
        this.overlayContainer
          .getContainerElement()
          .classList.add(darkClassName);
      } else {
        this.overlayContainer
          .getContainerElement()
          .classList.remove(darkClassName);
      }
    });
    this.permissionService.getModules().subscribe(res => {
      this.aModules = [
        ...res.map(el => (el.submodules ? { ...el, open: false } : el)),
      ];
    });

    this.subscriptions$.push(
      this.sideNavService.fullSized.subscribe(res => {
        this.fullSized = res;
      }),
    );
    this.subscriptions$.push(
      this.authService.userObservable.subscribe(res => {
        if (res) {
          this.user = res.user;
        }
      }),
    );
  }

  handleOpen(): void {
    this.hovered = true;
  }

  handleClose(): void {
    this.hovered = false;
  }

  handleLogout(): void {
    this.authService
      .logout()
      .pipe(take(1))
      .subscribe(() => void this.router.navigateByUrl('/login'));
  }

  toggleSideNavSize(): void {
    this.sideNavService.toggleSize();
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach(sub => sub.unsubscribe());
  }
}
