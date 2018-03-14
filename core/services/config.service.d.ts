export interface MainConfig {
    API_PORT?: number | string;
    DB_PORT?: string;
    DB_HOST?: string;
    DB_USERNAME?: string;
    DB_PASSWORD?: string;
    API_CERT?: string;
    DB_NAME?: string;
    TESTS_TOKEN?: string;
    GRAPHIQL_TOKEN?: string;
    ENDPOINT_TESTING?: string;
    NODE_ENV?: string;
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
        app: {
            local: MainConfig;
            prod: MainConfig;
        };
        test: {
            local: MainConfig;
            worker: MainConfig;
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
