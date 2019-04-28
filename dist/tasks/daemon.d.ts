import { CoreModuleConfig } from '@gapi/core';
export declare const DaemonTasks: {
    start: "start";
    stop: "stop";
    clean: "clean";
    kill: "kill";
    bootstrap: "bootstrap";
    link: "link";
    unlink: "unlink";
    list: "list";
};
export declare type DaemonTasks = keyof typeof DaemonTasks;
export declare class DaemonTask {
    private gapiFolder;
    private daemonFolder;
    private outLogFile;
    private errLogFile;
    private pidLogFile;
    private processListFile;
    private bootstrapTask;
    private systemDService;
    private start;
    private stop;
    private list;
    private kill;
    private link;
    private unlink;
    private clean;
    private genericRunner;
    private tasks;
    bootstrap: (options: CoreModuleConfig) => Promise<void>;
    run(): Promise<void>;
    private killDaemon;
    private readPidDaemonConfig;
    private isDaemonRunning;
    private getActiveDaemon;
}
