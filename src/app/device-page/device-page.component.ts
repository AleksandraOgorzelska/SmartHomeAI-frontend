import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceService } from '../services/device.service';
import { AccountService } from '../services/account.service';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { Device } from '../interfaces/device';
import { MatSliderChange, MatSlideToggleChange, MatSnackBar } from '@angular/material';
import {User} from '../interfaces/user';

@Component({
  selector: 'app-device-page',
  templateUrl: './device-page.component.html',
  styleUrls: ['./device-page.component.scss']
})
export class DevicePageComponent implements OnInit, OnDestroy {
  private device: Device;
  private slug: string;
  private owner: string;
  private mqtt_topic: string;
  private to_share: string
  private shared_to_users: User[];
  private capability_values: Map<string, any>;
  private subscription: Subscription;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private deviceService: DeviceService,
              private accountService: AccountService,
              private snackBar: MatSnackBar,
              private _mqttService: MqttService) { }

  ngOnInit() {
    this.owner = this.route.snapshot.params['owner'];
    this.slug = this.route.snapshot.params['slug'];
    this.deviceService.get_device(this.owner, this.slug).then(dev_response => {
      this.capability_values = new Map();
      this.capability_values.set(dev_response.mainCapability.name, dev_response.mainCapability.last_value);
      for (const cap of dev_response.capabilities) {
        this.capability_values.set(cap.name, cap.last_value);
      }
      this.device = dev_response;
      this.mqtt_topic = '/' + ((this.owner !== undefined) ? this.owner : this.accountService.get_username()) + '/' + this.device.slug;
      this.subscribe_capabilities();
      if (this.owner === undefined) {
        this.deviceService.get_shared_to_users(this.device.id).then(resp => {
          this.shared_to_users = resp;
          console.log(resp);
        });
      }
    }, err => {
      this.snackBar.open('Device not found!', 'OK', {duration: 1000});
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }

  private copyToClipboard(text: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = text;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.snackBar.open('Copied!', 'OK', {duration: 1000});
  }

  private subscribe_capabilities() {
    this.subscription = this._mqttService.observe(this.mqtt_topic + '/#').subscribe((message: IMqttMessage) => {
      const args: string[] = message.topic.split('/');
      const cap_slug: string = args[args.length - 1];
      const value = parseInt(message.payload.toString(), 10);
      console.log('Updated ' + cap_slug + ' component - value=' + value);
      this.capability_values.set(cap_slug, value);
    });
  }

  pub_switch(event: MatSlideToggleChange, capability: string) {
    this.deviceService.publish_status(this.mqtt_topic + '/' + capability, event.checked.valueOf() ? 1 : 0)
      .then(() => {
        console.log('Published ' + event.checked.valueOf() + ' to ' + this.mqtt_topic + '/' + capability);
      });
  }

  pub_slider(event: MatSliderChange, capability: string) {
    this.deviceService.publish_status(this.mqtt_topic + '/' + capability, event.value).then(() => {
      console.log('Published ' + String(event.value) + ' to ' + this.mqtt_topic + '/' + capability);
    });
  }

  share(to_share: string) {
    this.deviceService.share_device(this.device.id, to_share).then(uid => {
      this.snackBar.open('Device shared to ' + to_share, 'OK', {duration: 2000});
      const new_user: User = {id: uid, username: to_share};
      this.shared_to_users.push(new_user);
    }, err => {
      this.snackBar.open(err.error.message, 'OK', {duration: 2000});
    });
  }

  stopSharing(user: User) {
    this.deviceService.stop_sharing(this.device.id, user.username).then(() => {
      this.snackBar.open('You are no longer sharing this device to ' + user.username, 'OK', {duration: 2000});
      this.shared_to_users = this.shared_to_users.filter(u => u.id !== user.id);
    }, err => {
      this.snackBar.open(err.error.message, 'OK', {duration: 2000});
    });
  }
}
