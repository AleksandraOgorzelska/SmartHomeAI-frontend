import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Capability } from '../interfaces/capability';
import { DeviceType } from '../interfaces/device-type';
import { Device } from '../interfaces/device';
import { DeviceAction } from '../interfaces/device-action';
import { AddDeviceResponse } from '../interfaces/add-device-response';
import { DeviceHistoryResponse } from '../interfaces/device-history-response';
import {User} from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private http: HttpClient) { }

  public add_device(form: FormGroup): Promise<AddDeviceResponse> {

    const formData = JSON.stringify({
      devName: form.controls.devName.value,
      devType: form.controls.devType.value,
      mainCapability: form.controls.mainCapability.value,
      capabilities: form.controls.capabilities.value
    });

    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<AddDeviceResponse>('/api/device/add', formData, {headers: headers}).toPromise();
  }

  public get_capabilities(): Promise<Capability[]> {
    return this.http.get<Capability[]>('/api/device/capabilities').toPromise();
  }

  public get_device_types(): Promise<DeviceType[]> {
    return this.http.get<DeviceType[]>('/api/device/types').toPromise();
  }

  public get_my_devices(): Promise<Device[]> {
    return this.http.get<Device[]>('/api/device').toPromise();
  }

  public get_shared_devices(): Promise<Device[]> {
    return this.http.get<Device[]>('/api/device/shared').toPromise();
  }

  public get_device(owner: string, slug: string) {
    if (owner !== undefined) {
      return this.http.get<Device>('/api/device/' + owner + '/' + slug).toPromise();
    }
    return this.http.get<Device>('/api/device/' + slug).toPromise();
  }

  public add_action(deviceAction: DeviceAction): Promise<Object> {
    console.log(deviceAction);
    const requestData = {
      condition_device: deviceAction.condition_device,
      condition_capability: deviceAction.condition_capability.name,
      condition: deviceAction.condition,
      condition_value: deviceAction.condition_value,
      action_device: deviceAction.action_device,
      action_capability: deviceAction.action_capability.name,
      action_value: deviceAction.action_capability_value
    };
    console.log(requestData);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<Response>('/api/action', JSON.stringify(requestData), {headers: headers}).toPromise();
  }

  public get_actions(): Promise<DeviceAction[]> {
    return this.http.get<DeviceAction[]>('/api/action').toPromise();
  }

  public update_action_notify(action_id: number, notify: boolean) {
    const requestData = {
      action_id: action_id,
      notify: notify,
    };
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.put('api/action/notify', requestData, {headers: headers}).toPromise();
  }

  public delete_action(id: number) {
    return this.http.delete('api/action/' + id).toPromise();
  }

  public delete_device(id: number) {
    return this.http.delete('/api/device/' + id).toPromise();
  }

  public get_historical_data(owner: string, device: string, capability: string): Promise<DeviceHistoryResponse[]> {
    if (owner !== undefined) {
      return this.http.get<DeviceHistoryResponse[]>('/api/statushistory/' + owner + '/' + device + '/' + capability).toPromise();
    }
    return this.http.get<DeviceHistoryResponse[]>('/api/statushistory/' + device + '/' + capability).toPromise();
  }

  public publish_status(topic: string, value: number) {
    const requestData = {
      'topic': topic,
      'value': value
    };
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post('/api/statushistory', JSON.stringify(requestData), {headers: headers}).toPromise();
  }

  public share_device(id: number, to_share: string): Promise<number> {
    const requestData = {
      'deviceId': id,
      'username': to_share
    };
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<number>('/api/device/share', JSON.stringify(requestData), {headers: headers}).toPromise();
  }

  public get_shared_to_users(id: number): Promise<User[]> {
    return this.http.get<User[]>('/api/device/shared_to/' + id).toPromise();
  }

  public stop_sharing(deviceId: number, username: string) {
    return this.http.delete('/api/device/share/' + deviceId + '/' + username).toPromise();
  }

  public delete_share(deviceId: number) {
    return this.http.delete('/api/device/share/' + deviceId).toPromise();
  }
}
