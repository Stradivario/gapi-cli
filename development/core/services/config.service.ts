import { Service } from 'typedi';

export interface Commands { 
    commands: {
        docker: {
            start: string;
            stop: string;
            build: string;
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
        this.config = config;
    }
}