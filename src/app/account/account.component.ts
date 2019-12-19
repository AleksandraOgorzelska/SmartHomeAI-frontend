import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatTabChangeEvent } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  /**
   * Selected tab index (0 - register, 1 - login)
   */
  private selectedIndex: number;
  private loginForm: FormGroup;
  private loginError: string;
  private signUpForm: FormGroup;
  private signUpError: string;

  forms = {
    'register': 0,
    'login': 1
  };
  private routeSubscription: Subscription;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private accountService: AccountService,
              public snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.signUpForm = this.formBuilder.group({
      username: ['', Validators.required],
      password1: ['', Validators.required],
      password2: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
    });

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.routeSubscription = this.route.params.subscribe(params => {
      this.selectedIndex = this.forms[params['tab']];
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  private update_route(tabChangeEvent: MatTabChangeEvent) {
    const tab = tabChangeEvent.tab.textLabel.toLowerCase();
    this.router.navigate(['/account', tab]);
  }


  private register_account() {
    this.accountService.create_account(this.signUpForm).then(response => {
      this.snackBar.open('Account created!', 'OK', {duration: 2000});
      return this.router.navigate(['/home']);
    }, err => {
      this.signUpError = err.error.message;
    });
  }

  private login() {
    this.accountService.login(this.loginForm).then(() => {
      this.snackBar.open('Logged in!', 'OK', {duration: 2000});
      return this.router.navigate(['/home']);
    }, err => {
      if (err.status === 403) {
        this.loginError = 'Bad login or password.';
      } else if (err.status === 504) {
        this.loginError = 'Service is unavailable.';
      } else {
        console.log(err);
      }
    });
  }
}
