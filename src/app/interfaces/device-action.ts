import {DeviceCapability} from './device-capability';

export interface DeviceAction {
  id: number;
  condition_device: string;
  condition_capability: DeviceCapability;
  condition: string;
  condition_value: number;
  action_device: string;
  action_capability: DeviceCapability;
  action_capability_value: number;
  notify: boolean;
}
