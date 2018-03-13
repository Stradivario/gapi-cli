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
        };
    };
    config: {
        test: {
            local: TestConfig;
            worker: TestConfig;
        };
    };
}
export interface GapiConfig extends Commands {
    port: string;
}
export declare class ConfigService {
    config: GapiConfig;
    setCustomConfig(config: GapiConfig): void;
}
