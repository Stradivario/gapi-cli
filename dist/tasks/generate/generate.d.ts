export declare class GenerateTask {
    private configService;
    getPlatform(): import("../../core/services/config.service").Platforms;
    isServer(): boolean;
    isClient(): boolean;
    run(): Promise<void>;
}
