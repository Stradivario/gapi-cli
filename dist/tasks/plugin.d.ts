import { IpfsHashMapService } from "../daemon-server/core/services/ipfs-hash-map.service";
export declare class PluginTask {
    private ipfsHashMapService;
    constructor(ipfsHashMapService: IpfsHashMapService);
    run(): Promise<void>;
    add(hash: string): Promise<void>;
    private validateHash;
    remove(hash: string): Promise<void>;
    private readFile;
    private writeHashesToFile;
}
