import { DemoHardwareAdapter } from './demoHardwareAdapter';
import { HardwareMeasurementProvider } from './types';

let activeProvider: HardwareMeasurementProvider | null = null;

export function getHardwareProvider(): HardwareMeasurementProvider {
  if (!activeProvider) {
    activeProvider = new DemoHardwareAdapter();
  }
  return activeProvider;
}

export function resetHardwareProvider(): void {
  activeProvider = new DemoHardwareAdapter();
}

export * from './types';
export * from './validation';
export * from './demoHardwareAdapter';
