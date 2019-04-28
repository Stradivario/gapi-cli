import { CoreModuleConfig } from '@gapi/core';
export declare const DaemonTasks: {
    start: "start";
    stop: "stop";
    clean: "clean";
    kill: "kill";
    bootstrap: "bootstrap";
};
export declare type DaemonTasks = keyof typeof DaemonTasks;
export declare class DaemonTask {
    private gapiFolder;
    private daemonFolder;
    private outLogFile;
    private errLogFile;
    private pidLogFile;
    private bootstrapTask;
    private systemDService;
    private start;
    private stop;
    private kill;
    private clean;
    bootstrap(options: CoreModuleConfig): Promise<void>;
    private genericRunner;
    private tasks;
    run(): Promise<void>;
    private killDaemon;
    private readPidDaemonConfig;
    private isDaemonRunning;
    private getActiveDaemon;
}
