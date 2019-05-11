import { Injectable, ExternalImporterConfig } from '@gapi/core';
import { promisify } from 'util';
import { writeFile, exists, readFile } from 'fs';
import { IPFS_HASHED_MODULES_MAP } from '../../daemon.config';
export interface IPFS_MODULE_MAP {
    hash: string;
    module: ExternalImporterConfig;
  }
  
@Injectable()
export class IpfsHashMapService {
  hashMap: IPFS_MODULE_MAP[] = [];

  async writeHashMapToFile() {
    await promisify(writeFile)(IPFS_HASHED_MODULES_MAP, JSON.stringify(this.hashMap, null, 4), { encoding: 'utf8' });
  }

  async readHashMap() {
    if (await promisify(exists)(IPFS_HASHED_MODULES_MAP)) {
      this.hashMap = JSON.parse(await promisify(readFile)(IPFS_HASHED_MODULES_MAP, { encoding:'utf8' }));
    } else {
      await promisify(writeFile)(IPFS_HASHED_MODULES_MAP, JSON.stringify([], null, 4), { encoding: 'utf8' });
    }
  }
  find(hash: string) {
      return this.hashMap.filter(m => m.hash === hash)[0];
  }
  remove(hash: string) {
      this.hashMap = this.hashMap.filter(m => m.hash !== hash);
  }

}