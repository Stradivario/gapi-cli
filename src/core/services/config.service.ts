import { Service } from 'typedi';

export class MainConfig {
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
    schema: {
        introspectionEndpoint: string;
        introspectionOutputFolder: string;
        pattern: string;
    };
}
export class Commands {
    commands: {
        docker: {
            start: string;
            stop: string;
            build: string;
        }
    };
    config: GapiMainConfig;
}

export class GapiConfig extends Commands {
    port: string;
}

@Service()
export class ConfigService {
    config: GapiConfig = new GapiConfig();

    setCustomConfig(config: GapiConfig) {
        Object.assign(this.config, config);
        if (!config) {
            config = <any>{};
        }
        if (!config.commands) {
            config.commands = <any>{};
        } else {
            if (config.commands['test']) {
                this.genericError('test');
            }
            if (config.commands['new']) {
                this.genericError('new');
            }
            if (config.commands['schema']) {
                this.genericError('schema');
            }
            if (config.commands['start']) {
                this.genericError('start');
            }
            if (config.commands['stop']) {
                this.genericError('stop');
            }
        }
        this.config = config;
        this.config.config = this.config.config || <any>{};
        this.config.config.schema = this.config.config.schema || {
            introspectionEndpoint: '',
            introspectionOutputFolder: '',
            pattern: ''
        }
        this.config.config.app = this.config.config.app || {
            local: {
                GAPI_VERSION: ''
            },
            prod: {
                GAPI_VERSION: ''
            },
        }
    }

    genericError(command: string) {
        throw new Error(`You cannot define command "${command}" they are restricted!`);
    }
}