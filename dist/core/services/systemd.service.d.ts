interface SystemDServiceInterface {
    name: string;
    cwd: string;
    app: string;
    env?: {
        [key: string]: any;
    };
    engine: 'node' | 'forever' | 'pm2';
}
export declare class SystemDService {
    private gapiFolder;
    private daemonFolder;
    private services;
    private readServicesFile;
    remove(name: string): Promise<void>;
    register(options: SystemDServiceInterface): Promise<void>;
}
export {};
