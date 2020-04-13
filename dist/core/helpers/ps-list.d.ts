export interface Process {
    pid: number;
    name: string;
    cmd?: string;
    ppid: number;
    uid?: number;
    cpu?: number;
    memory?: number;
}
export declare const getProcessList: (options?: {
    all: any;
}) => Promise<Process[]>;
