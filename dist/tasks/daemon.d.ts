export declare const DaemonTasks: {
    start: "start";
    stop: "stop";
    clean: "clean";
    kill: "kill";
};
export declare type DaemonTasks = keyof typeof DaemonTasks;
export declare class DaemonTask {
    private gapiFolder;
    private daemonFolder;
    private outLogFile;
    private errLogFile;
    private pidLogFile;
    private start;
    private stop;
    private kill;
    private clean;
    private genericRunner;
    private tasks;
    run(): Promise<void>;
    private killDaemon;
    private readPidDaemonConfig;
    private isDaemonRunning;
    private getActiveDaemon;
}
