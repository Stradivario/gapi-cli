export declare class MainConfig {
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
    GAPI_VERSION?: string;
}
export declare type Platforms = 'server' | 'client';
export interface SchematicsConfig {
    name: string;
    dryRun: boolean;
    hasSpec: boolean;
    platform: Platforms;
}
export interface GapiMainConfig {
    deploy: {
        app_name: string;
    };
    app: {
        local: MainConfig | string;
        prod: MainConfig | string;
    };
    test: {
        prod: MainConfig | string;
        local: MainConfig | string;
        worker: MainConfig | string;
    };
    schematics: SchematicsConfig;
    schema: {
        linkName: string;
        excludedFolders: string[];
        introspectionEndpoint: string;
        introspectionOutputFolder: string;
        pattern: string;
    };
}
export declare class Commands {
    commands: {
        docker: {
            start: string;
            stop: string;
            build: string;
        };
    };
    config: GapiMainConfig;
}
export declare class GapiConfig extends Commands {
    port: string;
}
export declare class ConfigService {
    config: GapiConfig;
    setCustomConfig(config: GapiConfig): void;
    getSchematicsConfig(): SchematicsConfig;
    genericError(command: string): void;
}
