import defaultConfig from './default.config';
import { StatusMonitorOptions } from '../interfaces/status-monitor-module-options.interface';

export function createConfig(
  {
    chartVisibility,
    healthChecks = [],
    ignoreStartsWith = defaultConfig.ignoreStartsWith,
    pageTitle = defaultConfig.pageTitle,
    path = defaultConfig.path,
    port = defaultConfig.port,
    spans = defaultConfig.spans,
  }: StatusMonitorOptions
): StatusMonitorOptions {
  return {
    healthChecks,
    ignoreStartsWith,
    pageTitle,
    path,
    port,
    spans,
    chartVisibility: Object.assign({}, defaultConfig.chartVisibility, chartVisibility),
  }
}
