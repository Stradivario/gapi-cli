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
  GAPI_DAEMON_PLUGINS_FOLDER
} from "../../daemon.config";
import { PluginWatcherService } from "./plugin-watcher.service";

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
      throw new Error("Missing cache module ${JSON.stringify(m)}");
    }
    this.cacheModule(currentModule);
    return currentModule;
  }

  private makePluginsDirectories() {
    return of(true).pipe(
      switchMap(() =>
        this.fileService.mkdirp(GAPI_DAEMON_EXTERNAL_PLUGINS_FOLDER)
      ),
      switchMap(() => this.fileService.mkdirp(GAPI_DAEMON_PLUGINS_FOLDER))
    );
  }

  loadPlugins(ipfsHashes: string[] = []) {
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
            [...new Set(ipfsHashes)].map(hash => this.getModule(hash))
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
      m => this.cache[m]
    );
  }
}
