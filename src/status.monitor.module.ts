import {
  Module,
  MiddlewareConsumer,
  RequestMethod,
  DynamicModule,
  Provider,
} from '@nestjs/common';
import { PATH_METADATA } from '@nestjs/common/constants';
import { StatusMonitorController } from './status.monitor.controller';
import { StatusMonitorGateway } from './status.monitor.gateway';
import { StatusMonitoringService } from './status.monitoring.service';
import { StatusMonitorMiddleware } from './status.monitor.middleware';
import { HealthCheckService } from './health.check.service';
import { STATUS_MONITOR_OPTIONS_PROVIDER } from './status.monitor.constants';
import {
  StatusMonitorOptions,
  StatusMonitorOptionsFactory,
  StatusMonitorAsyncOptions
} from './interfaces/status-monitor-module-options.interface';
import { createConfig } from './createConfig';

@Module({
  controllers: [StatusMonitorController],
  providers: [
    StatusMonitorGateway,
    StatusMonitoringService,
    HealthCheckService,
  ],
})
export class StatusMonitorModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(StatusMonitorMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }

  public static forRoot(options: StatusMonitorOptions): DynamicModule {
    const config = createConfig(options);
    Reflect.defineMetadata(PATH_METADATA, config.path, StatusMonitorController);
    return {
      module: StatusMonitorModule,
      providers: [
        {
          provide: STATUS_MONITOR_OPTIONS_PROVIDER,
          useValue: config,
        },
        StatusMonitorGateway,
        StatusMonitoringService,
        HealthCheckService,
      ],
      controllers: [StatusMonitorController],
    }
  }

  public static forRootAsync(options: StatusMonitorAsyncOptions): DynamicModule {
    return {
      module: StatusMonitorModule,
      controllers: [StatusMonitorController],
      providers: [
        ...this.createAsyncProviders(options),
        StatusMonitorGateway,
        StatusMonitoringService,
        HealthCheckService,
      ]
    }
  }

  private static createAsyncProviders(options: StatusMonitorAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass
      }
    ];
  }

  private static createAsyncOptionsProvider(options: StatusMonitorAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: STATUS_MONITOR_OPTIONS_PROVIDER,
        useFactory: async (...args: any) => {
          const config = createConfig(await options.useFactory(...args));
          Reflect.defineMetadata(PATH_METADATA, config.path, StatusMonitorController);
          return config;
        },
        inject: options.inject || []
      };
    }
    return {
      provide: STATUS_MONITOR_OPTIONS_PROVIDER,
      useFactory: async (optionsFactory: StatusMonitorOptionsFactory) => {
        const config = createConfig(await optionsFactory.createStatusMonitorOptions());
        Reflect.defineMetadata(PATH_METADATA, config.path, StatusMonitorController);
        return config;
      },
      inject: [options.useExisting || options.useClass]
    };
  }
}
