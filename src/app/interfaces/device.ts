import { DeviceType } from './device-type';
import { DeviceCapability } from './device-capability';

export interface Device {
  id: number;
  name: string;
  slug: string;
  type: DeviceType;
  owner: string;
  mainCapability: DeviceCapability;
  capabilities: DeviceCapability[];
}
