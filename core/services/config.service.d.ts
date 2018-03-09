export interface Commands {
    commands: {
        docker: {
            start: string;
            stop: string;
            build: string;
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
