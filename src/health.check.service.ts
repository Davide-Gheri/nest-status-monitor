import { Injectable, Inject } from '@nestjs/common';
import axios from 'axios';
import { STATUS_MONITOR_OPTIONS_PROVIDER } from './status.monitor.constants';
import { StatusMonitorOptions } from './interfaces/status-monitor-module-options.interface';
import { HealthCheckOptions } from './interfaces/health-check-options.interface';

@Injectable()
export class HealthCheckService {
  healthChecks: HealthCheckOptions[] = [];

  constructor(
    @Inject(STATUS_MONITOR_OPTIONS_PROVIDER) config: StatusMonitorOptions,
  ) {
    this.healthChecks = config.healthChecks;
  }

  checkAllEndpoints() {
    const checkPromises = [];

    this.healthChecks.forEach(healthCheck => {
      checkPromises.push(this.checkEndpoint(healthCheck));
    });

    let checkResults = [];

    return this.allSettled(checkPromises).then(results => {
      results.forEach((result, index) => {
        if (result.state === 'rejected') {
          checkResults.push({
            path: this.healthChecks[index].path,
            status: 'failed',
          });
        } else {
          checkResults.push({
            path: this.healthChecks[index].path,
            status: 'ok',
          });
        }
      });

      return checkResults;
    });
  }

  private checkEndpoint(healthCheck): Promise<any> {
    let uri = `${healthCheck.protocol}://${healthCheck.host}`;

    if (healthCheck.port) {
      uri += `:${healthCheck.port}`;
    }

    uri += healthCheck.path;

    //TODO (ivasiljevic) use http service instead of axios
    return axios({
      url: uri,
      method: 'GET',
    });
  }

  private allSettled(promises: Promise<any>[]): Promise<any> {
    let wrappedPromises = promises.map(p =>
      Promise.resolve(p).then(
        val => ({ state: 'fulfilled', value: val }),
        err => ({ state: 'rejected', value: err }),
      ),
    );

    return Promise.all(wrappedPromises);
  }
}
