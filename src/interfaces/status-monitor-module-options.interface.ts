import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { ChartVisibilityOptions } from './chart-visibility-options.interface';
import { HealthCheckOptions } from './health-check-options.interface';
import { SpansOptions } from './spans-options.interface';

export interface StatusMonitorOptions {
  path?: string;
  port?: number;
  pageTitle?: string;
  ignoreStartsWith?: string;
  healthChecks?: HealthCheckOptions[];
  spans?: SpansOptions[];
  chartVisibility?: ChartVisibilityOptions;
}

export interface StatusMonitorOptionsFactory {
  createStatusMonitorOptions(): Promise<StatusMonitorOptions> | StatusMonitorOptions;
}

export interface StatusMonitorAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useClass?: Type<StatusMonitorOptionsFactory>;
  useExisting?: Type<StatusMonitorOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<StatusMonitorOptions> | StatusMonitorOptions;
  inject?: any[];
}
