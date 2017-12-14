import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDataStoreService } from '../../../shared/data-stores/user-data-store.service';
import { APP_ROUTE_URLS } from '../../../../constants/app-constants';
import { Restangular } from 'ngx-restangular';
import { ApiURLMap } from '../../../../constants/api-urls';
import { LoginService } from '../../../account/login/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() userLoggedIn: boolean;
  logoutInProgress = false;
  user: any = {};

  constructor(private router: Router, private userData: UserDataStoreService,
              private loginService: LoginService) {
  }

  subscribeUserData() {
    this.userData.token$.subscribe(
      token => this.userLoggedIn = Boolean(token)
    );
    this.userData.userData$.subscribe(
      data => this.user = data
    );
  }

  ngOnInit() {
    this.subscribeUserData();
  }

  logout() {
    if (!this.logoutInProgress) {
      this.logoutInProgress = true;
      return this.loginService.logout().subscribe(
        data => {
          this.userData.clearUserData();
          this.logoutInProgress = false;
          this.router.navigateByUrl(APP_ROUTE_URLS.login);
        }
      );
    }
  }
}