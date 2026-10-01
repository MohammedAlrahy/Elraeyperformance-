import { requireNativeModule } from 'expo-modules-core';

export type DeviceInfo = {
  model: string; manufacturer: string; brand: string; device: string; androidVersion: string; apiLevel: number;
  resolution: string; density: number; totalRamBytes: number; availableRamBytes: number;
  totalStorageBytes: number; freeStorageBytes: number; lowMemory: boolean; cpuCores: number; cpuAbi: string;
};
export type DisplayMode = { id: number; width: number; height: number; refreshRate: number };
export type DisplayInfo = { currentRefreshRate: number; supportedRefreshRates: number[]; modes: DisplayMode[]; isHdr: boolean };
export type BatteryInfo = { percent: number; temperatureC: number | null; voltageMv: number; charging: boolean; plugged: number };
export type CpuSnapshot = { total: number; idle: number };
export type CpuUsage = { usage: number; total: number; idle: number };
export type LaunchableApp = { packageName: string; name: string; isGame: boolean };

const Native = requireNativeModule('ElraeyPerformance') as {
  getDeviceInfo(): DeviceInfo;
  getDisplayInfo(): DisplayInfo;
  setPreferredRefreshRate(rate: number): boolean;
  openDisplaySettings(): boolean;
  openAppSettings(): boolean;
  getBatteryInfo(): BatteryInfo;
  getCpuSnapshot(): CpuSnapshot;
  getCpuUsage(previousTotal: number, previousIdle: number): CpuUsage;
  canDrawOverlays(): boolean;
  openOverlaySettings(): boolean;
  getLaunchableApps(): Promise<LaunchableApp[]>;
  launchApp(packageName: string): boolean;
};
export default Native;
