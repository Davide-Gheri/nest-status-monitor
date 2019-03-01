import {
  Injectable,
  NestMiddleware,
  MiddlewareFunction,
  Inject,
} from '@nestjs/common';
import * as onHeaders from 'on-headers';
import { StatusMonitoringService } from './status.monitoring.service';
import { STATUS_MONITOR_OPTIONS_PROVIDER } from './status.monitor.constants';
import { StatusMonitorOptions } from './interfaces/status-monitor-module-options.interface';

@Injectable()
export class StatusMonitorMiddleware implements NestMiddleware {
  constructor(
    private readonly statusMonitoringService: StatusMonitoringService,
    @Inject(STATUS_MONITOR_OPTIONS_PROVIDER)
    private readonly config: StatusMonitorOptions,
  ) {}

  resolve(...args: any[]): MiddlewareFunction {
    return (req, res, next) => {
      if (
        this.config.ignoreStartsWith &&
        !req.originalUrl.startsWith(this.config.ignoreStartsWith) &&
        !req.originalUrl.startsWith(this.config.path)
      ) {
        const startTime = process.hrtime();
        onHeaders(res, () => {
          this.statusMonitoringService.collectResponseTime(
            res.statusCode,
            startTime,
          );
        });
      }

      next();
    };
  }
}
