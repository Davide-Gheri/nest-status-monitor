import { Test, TestingModule } from '@nestjs/testing';
import { StatusMonitorModule, StatusMonitorOptions, StatusMonitorOptionsFactory } from '../index';
import { STATUS_MONITOR_OPTIONS_PROVIDER } from '../status.monitor.constants';
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

describe('Status Monitor Module, sync booting', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        StatusMonitorModule.forRoot(stubOptions),
      ],
    }).compile();
  });
  it('should provide the full monitoring options', () => {
    const options = module.get(STATUS_MONITOR_OPTIONS_PROVIDER);
    expect(options).toEqual(expectedConfig);
  });
});

describe('Status Monitor Module, async booting', () => {
  let module: TestingModule;

  it('should boot correctly using useFactory', async () => {
    module = await Test.createTestingModule({
      imports: [
        StatusMonitorModule.forRootAsync({
          useFactory: () => {
            return stubOptions;
          }
        }),
      ],
    }).compile();

    expect(module).toBeDefined();
    const options = module.get(STATUS_MONITOR_OPTIONS_PROVIDER);
    expect(options).toEqual(expectedConfig);
  });

  it('should boot correctly using useClass', async () => {
    class StatusOptionFactory implements StatusMonitorOptionsFactory {
      createStatusMonitorOptions(): Promise<StatusMonitorOptions> | StatusMonitorOptions {
        return Promise.resolve(stubOptions);
      }
    }

    module = await Test.createTestingModule({
      imports: [
        StatusMonitorModule.forRootAsync({
          useClass: StatusOptionFactory
        }),
      ],
    }).compile();

    expect(module).toBeDefined();
    const options = module.get(STATUS_MONITOR_OPTIONS_PROVIDER);
    expect(options).toEqual(expectedConfig);
  });
});
