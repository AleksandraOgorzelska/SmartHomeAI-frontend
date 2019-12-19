import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AccountComponent } from './account/account.component';
import { ProfileComponent } from './profile/profile.component';
import { DeviceComponent } from './device/device.component';
import { DevicePageComponent } from './device-page/device-page.component';
import { ActionComponent } from './action/action.component';
import { ChartComponent } from './chart/chart.component';
import {UserGuard} from './UserGuard';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'account', component: AccountComponent},
  {path: 'account/:tab', component: AccountComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [UserGuard]},
  {path: 'profile/:tab', component: ProfileComponent, canActivate: [UserGuard]},
  {path: 'devices', component: DeviceComponent, canActivate: [UserGuard]},
  {path: 'device/:slug', component: DevicePageComponent, canActivate: [UserGuard]},
  {path: 'device/:owner/:slug', component: DevicePageComponent, canActivate: [UserGuard]},
  {path: 'device/:name', component: DeviceComponent, canActivate: [UserGuard]},
  {path: 'actions', component: ActionComponent, canActivate: [UserGuard]},
  {path: 'chart/:owner/:device/:capability', component: ChartComponent, canActivate: [UserGuard]},
  {path: 'chart/:device/:capability', component: ChartComponent, canActivate: [UserGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
