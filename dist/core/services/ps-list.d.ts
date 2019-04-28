interface Process {
    pid: number;
    name: string;
    cmd: string;
    ppid: number;
    uid: number;
    cpu: number;
    memory: number;
}
export declare const processList: () => Promise<Process[]>;
export {};
