export interface GapiConfig {
    port: string;
    commands: {
        docker: {
            start: string;
            stop: string;
            build: string;
        };
    };
}
export declare class ConfigService {
    config: GapiConfig;
    setCustomConfig(config: GapiConfig): void;
}
