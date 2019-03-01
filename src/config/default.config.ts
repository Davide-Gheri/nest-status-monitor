import { StatusMonitorOptions } from '../interfaces/status-monitor-module-options.interface';

const configuration: StatusMonitorOptions & { theme: string; } = {
  pageTitle: 'Express Status',
  theme: 'default.css',
  path: '/status',
  spans: [
    {
      interval: 1,
      retention: 60,
    },
    {
      interval: 5,
      retention: 60,
    },
    {
      interval: 15,
      retention: 60,
    },
  ],
  port: null,
  chartVisibility: {
    cpu: true,
    mem: true,
    load: true,
    responseTime: true,
    rps: true,
    statusCodes: true,
  },
  ignoreStartsWith: null,
  healthChecks: [],
};

export default configuration;
