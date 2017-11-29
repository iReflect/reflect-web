import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../api/api.service';
import { UserDataStoreService } from '../../../shared/data-stores/user-data-store.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() userLoggedIn: boolean;
  logoutInProgress = false;
  user: any = {};

  constructor(private router: Router, private apiService: ApiService,
              private userData: UserDataStoreService) {
  }

  ngOnInit() {
    this.userData.token$.subscribe(
      token => this.userLoggedIn = Boolean(token)
    );
    this.userData.userData$.subscribe(
      data => this.user = data
    );
  }

  logout() {
    if (!this.logoutInProgress) {
      this.logoutInProgress = true;
      return this.apiService.apiDELETE('logout').subscribe(
        data => {
          this.userData.updateUserMultipleValues({});
          this.userData.setToken$('');
          this.logoutInProgress = false;
          this.router.navigateByUrl('/login');
        }
      );
    }
  }
}
