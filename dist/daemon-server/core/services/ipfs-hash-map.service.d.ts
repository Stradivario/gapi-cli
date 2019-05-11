import { ExternalImporterConfig } from '@gapi/core';
export interface IPFS_MODULE_MAP {
    hash: string;
    module: ExternalImporterConfig;
}
export declare class IpfsHashMapService {
    hashMap: IPFS_MODULE_MAP[];
    writeHashMapToFile(): Promise<void>;
    readHashMap(): Promise<void>;
    find(hash: string): IPFS_MODULE_MAP;
    remove(hash: string): void;
}
