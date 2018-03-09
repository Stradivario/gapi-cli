import { Service } from 'typedi';

export interface GapiConfig {
    port: string;
    commands: {
        docker: {
            start: string;
            stop: string;
            build: string;
        }
    };
}

@Service()
export class ConfigService {
    config: GapiConfig;

    setCustomConfig(config: GapiConfig) {
        this.config = config;
    }
}