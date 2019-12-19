import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from '@angular/cdk/layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { AccountComponent } from './account/account.component';
import { AccountService } from './services/account.service';
import { ProfileComponent } from './profile/profile.component';
import { IMqttServiceOptions, MqttModule } from 'ngx-mqtt';
import { DeviceComponent } from './device/device.component';
import { DeviceService } from './services/device.service';
import { DevicePageComponent } from './device-page/device-page.component';
import { AngularFullpageModule } from '@fullpage/angular-fullpage';
import { ActionComponent } from './action/action.component';
import { ChartComponent } from './chart/chart.component';
import { JwtModule } from '@auth0/angular-jwt';

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: 'localhost',
  port: 1884,
  path: '',
  protocol: 'ws',
  rejectUnauthorized: false
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AccountComponent,
    ProfileComponent,
    DeviceComponent,
    DevicePageComponent,
    ActionComponent,
    ChartComponent
  ],
  imports: [
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
    JwtModule.forRoot({
      config: {
        tokenGetter: function  tokenGetter() {
          return localStorage.getItem('access_token'); },
        whitelistedDomains: ['localhost:8080'],
        blacklistedRoutes: ['/api/account/login']
      }
    }),
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    AngularFullpageModule
  ],
  providers: [AccountService, DeviceService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
