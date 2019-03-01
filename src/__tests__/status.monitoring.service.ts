import { Test, TestingModule } from '@nestjs/testing';
import { StatusMonitorModule } from '../status.monitor.module';
import { StatusMonitoringService } from '../status.monitoring.service';
import defaultConfig from '../config/default.config';

const stubOptions = {
  path: '/status',
  port: 5000,
};

const expectedConfig = {
  ...defaultConfig,
  ...stubOptions,
};
delete expectedConfig.theme;

describe('Status Monitoring Service', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        StatusMonitorModule.forRoot(stubOptions)
      ],
    }).compile();
  });

  it('should be defined', () => {
    const service = module.get<StatusMonitoringService>(StatusMonitoringService);
    expect(service).toBeDefined();
    expect(service.config).toEqual(expectedConfig);
  });

  it('should register many spans as defined in config', () => {
    const service = module.get<StatusMonitoringService>(StatusMonitoringService);
    const expectedSpans = expectedConfig.spans.map((span) => ({
      interval: span.interval,
      retention: span.retention,
      os: expect.any(Array),
      responses: expect.any(Array),
    }));

    expect(service.spans).toEqual(expectedSpans);
    expect(service.getData()).toEqual(expectedSpans);
  });
});
