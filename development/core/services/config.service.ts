import { Service } from 'typedi';
export interface TestConfig {
    db_port: string;
    db_host: string;
    db_user: string;
    db_pass: string;
    db_name: string;
    token: string;
    endpoint: string;
}
export interface Commands {
    commands: {
        docker: {
            start: string;
            stop: string;
            build: string;
        }
    };
    config: {
        test: {
            local: TestConfig;
            worker: TestConfig;
        }
    };
}

export interface GapiConfig extends Commands {
    port: string;
}

@Service()
export class ConfigService {
    config: GapiConfig;

    setCustomConfig(config: GapiConfig) {
        if (config.commands['test']) {
            throw new Error('You cannot define command "test" they are restricted!');
        }
        if (config.commands['new']) {
            throw new Error('You cannot define command "new" they are restricted!');
        }
        this.config = config;
    }
}