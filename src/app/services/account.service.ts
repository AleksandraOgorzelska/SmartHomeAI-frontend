import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { SignUpResponse } from '../interfaces/sign-up-response';
import { LoginResponse } from '../interfaces/login-response';
import {tap} from 'rxjs/operators';
import {NotificationConfig} from '../interfaces/notification-config';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  username: string;

  constructor(private http: HttpClient) {}

  public create_account(form: FormGroup): Promise<SignUpResponse> {
    const formData = JSON.stringify({
      username: form.value.username,
      password: form.value.password1,
      matchingPassword: form.value.password2,
      email: form.value.email,
    });
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<SignUpResponse>('/api/account/create', formData, {headers: headers}).toPromise();
  }

  public logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    this.username = null;
  }

  public login(loginForm: FormGroup) {
    const formData = JSON.stringify({
      'username': loginForm.value.username,
      'password': loginForm.value.password
    });
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<LoginResponse>('/api/account/login', formData, {headers: headers, observe: 'response'})
      .pipe(tap(response => {
        localStorage.setItem('access_token', response.headers.get('authorization').replace('Bearer', ''));
        localStorage.setItem('username', loginForm.value.username);
        this.username = loginForm.value.username;
      })).toPromise();
  }

  public isAuthenticated(): Promise<boolean> {
    return this.http.get<boolean>('/api/account/authenticated').toPromise();
  }

  public get_username(): string {
    return this.username;
  }

  public get_notification_config(): Promise<NotificationConfig> {
    return this.http.get<NotificationConfig>('/api/account/notification_config').toPromise();
  }

  public put_telegram_token(token) {
    const formData = JSON.stringify({
      telegramToken: token
    });
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.put('/api/account/telegram_token', formData, {headers: headers}).toPromise();
  }

  public connect_telegram() {
    return this.http.get('/api/account/telegram_connect').toPromise();
  }

  public update_email(email) {
    const formData = JSON.stringify({
      email: email
    });
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.put('/api/account/email', formData, {headers: headers}).toPromise();
  }

  public update_telegram_notification(notify: any) {
    const formData = JSON.stringify({
      telegramNotification: notify
    });
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.put('/api/account/telegram/notification', formData, {headers: headers}).toPromise();
  }

  public update_email_notification(notify: any) {
    const formData = JSON.stringify({
      emailNotification: notify
    });
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.put('/api/account/email/notification', formData, {headers: headers}).toPromise();
  }
}
