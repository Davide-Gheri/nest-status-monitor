import { StatusMonitorOptions } from '../../../src/interfaces/status-monitor-module-options.interface';

export default {
  pageTitle: 'Nest.js Monitoring Page',
  port: 3001,
  path: '/healthcheck',
  ignoreStartsWith: '/healt/alive',
  healthChecks: [
    {
      protocol: 'http',
      host: 'localhost',
      path: '/health/alive',
      port: 3001,
    },
    {
      protocol: 'http',
      host: 'localhost',
      path: '/health/dead',
      port: 3001,
    },
  ],
  chartVisibility: {
    cpu: false,
    mem: false,
  }
} as StatusMonitorOptions;
