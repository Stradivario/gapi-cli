import {
  Injectable,
  ExternalImporter,
  ExternalModuleConfiguration,
  FileService,
  Metadata
} from "@rxdi/core";
import { take, switchMap, map, combineLatest, tap } from "rxjs/operators";
import { of, Subject } from "rxjs";
import {
  GAPI_DAEMON_EXTERNAL_PLUGINS_FOLDER,
  GAPI_DAEMON_PLUGINS_FOLDER,
  IPFS_HASHED_MODULES
} from "../../daemon.config";
import { PluginWatcherService } from "./plugin-watcher.service";
import { readFileSync, writeFile, exists } from "fs";
import { promisify } from "util";

interface CustomMetadata extends Function {
  metadata: Metadata;
}

@Injectable()
export class PluginLoader {
  private defaultIpfsProvider = "https://ipfs.io/ipfs/";
  private defaultDownloadFilename = "gapi-plugin";

  fileWatcher: Subject<string[]> = new Subject();
  cache: { [key: string]: CustomMetadata } = {};

  constructor(
    private externalImporterService: ExternalImporter,
    private fileService: FileService,
    private pluginWatcherService: PluginWatcherService
  ) {}

  getModule(hash: string, provider: string = this.defaultIpfsProvider) {
    if (this.isModuleHashed(hash)) {
      return this.cache[hash];
    }
    return this.externalImporterService
      .downloadIpfsModuleConfig({
        hash,
        provider
      })
      .pipe(
        take(1),

        switchMap((externalModule: ExternalModuleConfiguration) =>
          this.externalImporterService.importModule(
            {
              fileName: this.defaultDownloadFilename,
              namespace: externalModule.name,
              extension: "js",
              outputFolder: `${GAPI_DAEMON_EXTERNAL_PLUGINS_FOLDER}/`,
              link: `${this.defaultIpfsProvider}${externalModule.module}`
            },
            externalModule.name,
            { folderOverride: `//` }
          )
        ),
        map((data: Function) => {
          const currentModule = this.loadModule(data);
          this.cache[hash] = currentModule;
          return currentModule;
        })
      );
  }

  private isModuleHashed(hash: string) {
    return !!this.cache[hash];
  }

  private cacheModule(currentModule: CustomMetadata) {
    if (currentModule.metadata) {
      this.cache[currentModule.metadata.moduleHash] = currentModule;
    }
  }

  private loadModule(m: Function): CustomMetadata {
    const currentModule: CustomMetadata = m[Object.keys(m)[0]];
    if (!currentModule) {
      throw new Error(`Missing cache module ${JSON.stringify(m)}`);
    }
    this.cacheModule(currentModule);
    return currentModule;
  }

  private async makeIpfsHashFile() {
    if (!(await promisify(exists)(IPFS_HASHED_MODULES))) {
      await promisify(writeFile)(IPFS_HASHED_MODULES, JSON.stringify([], null, 4), { encoding: 'utf8' });
    }
  }

  private makePluginsDirectories() {
    return of(true).pipe(
      switchMap(() =>
        this.fileService.mkdirp(GAPI_DAEMON_EXTERNAL_PLUGINS_FOLDER)
      ),
      switchMap(() => this.fileService.mkdirp(GAPI_DAEMON_PLUGINS_FOLDER)),
      switchMap(() => this.makeIpfsHashFile()),
    );
  }

  loadIpfsHashes() {
    let hashes = [];
    try {
      hashes = JSON.parse(readFileSync(IPFS_HASHED_MODULES, { encoding: 'utf8' }));
    } catch (e) {}
    return hashes;
  }

  loadPlugins() {
    return this.makePluginsDirectories().pipe(
      switchMap(() => this.pluginWatcherService.watch()),
      // switchMap(() => this.fileService.fileWalker(pluginsFolder)),
      map(p =>
        [...new Set(p)].map(path =>
          !new RegExp(/^(.(?!.*\.js$))*$/g).test(path)
            ? this.loadModule(require(path))
            : null
        )
      ),
      switchMap(pluginModules =>
        of(null).pipe(
          combineLatest(
            [...new Set(this.loadIpfsHashes())].map(hash => this.getModule(hash))
          ),
          map(externalModules => externalModules.concat(pluginModules)),
          map(m => m.filter(i => !!i)),
          map((modules: CustomMetadata[]) => this.filterDups(modules))
        )
      )
    );
  }

  private filterDups(modules: CustomMetadata[]) {
    return [...new Set(modules.map(i => i.metadata.moduleHash))].map(
      m => {
        console.log(m);
        return this.cache[m];
      }
    );
  }
}
