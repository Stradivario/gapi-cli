import { Service } from "@rxdi/core";
import { nextOrDefault, includes } from '../core/helpers/index';
import { promisify } from "util";
import { readFile, exists, writeFile } from "fs";
import { IPFS_HASHED_MODULES } from "../daemon-server/daemon.config";

@Service()
export class PluginTask {
 
  async run() {
    if (includes('remove')) {
      return await this.remove(nextOrDefault('remove', false))
    }
    if (includes('add')) {
      return await this.add(nextOrDefault('add', false))
    }
  }

  async add(hash: string) {
    this.validateHash(hash);
      const hashes = await this.readFile();
      const exist = hashes.filter(h => h === hash);
      if (exist.length) {
        console.error(`Plugin already exist ${hash}`);
        return;
      }
      await this.writeHashesToFile([...hashes, hash]);
      console.log(`Plugin installed ${hash}`);
    if (!hash) {
      throw new Error('Missing ipfs hash');
    }
  }

  private validateHash(hash: string) {
    if (!hash || hash.length !== 46) {
      throw new Error(`This is not correct ipfs hash ${hash}`);
    }
  }

  async remove(hash: string) {
    this.validateHash(hash);
    await this.writeHashesToFile((await this.readFile()).filter(h => h !== hash))
  }

  private async readFile() {
    let hashes: string[] = [];
    if (await promisify(exists)(IPFS_HASHED_MODULES)) {
      hashes = JSON.parse(await promisify(readFile)(IPFS_HASHED_MODULES, { encoding:'utf8' }));
    } else {
      await promisify(writeFile)(IPFS_HASHED_MODULES, JSON.stringify([], null, 4), { encoding: 'utf8' });
    }
    return hashes;
  }

  private async writeHashesToFile(hashes: string[]) {
    await promisify(writeFile)(IPFS_HASHED_MODULES, JSON.stringify(hashes, null, 4), { encoding: 'utf8' });
 
  }
}
