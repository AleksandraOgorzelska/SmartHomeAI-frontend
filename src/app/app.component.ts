import { Component, OnDestroy, OnInit } from '@angular/core';
import {AccountService} from './services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  accountService: AccountService;

  constructor(accountService: AccountService) {
    this.accountService = accountService;
  }

  title = 'smart-home';
  nightmode = false;
  public ngOnInit() {
    if (localStorage.getItem('username') && this.accountService.username == null) {
      this.accountService.username = localStorage.getItem('username');
    }
  }

  public ngOnDestroy(): void {
  }


  changeTheme() {
    this.nightmode = !this.nightmode;
  }
}
