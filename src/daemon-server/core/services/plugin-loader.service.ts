import {
  Injectable,
  ExternalImporter,
  ExternalModuleConfiguration,
  FileService,
  Metadata
} from "@rxdi/core";
import { take, switchMap, map, combineLatest, tap } from "rxjs/operators";
import { of } from "rxjs";
import { GAPI_DAEMON_EXTERNAL_PLUGINS_FOLDER, GAPI_DAEMON_PLUGINS_FOLDER } from "../../daemon.config";

@Injectable()
export class PluginLoader {
  private hashCache: { [key: string]: { metadata: Metadata } } = {};
  private defaultIpfsProvider = "https://ipfs.io/ipfs/";
  private defaultDownloadFilename = "gapi-plugin";

  constructor(
    private externalImporterService: ExternalImporter,
    private fileService: FileService
  ) {}

  getModule(hash: string, provider: string = this.defaultIpfsProvider) {
    if (this.hashCache[hash]) {
      return this.hashCache[hash];
    }
    return this.externalImporterService
      .downloadIpfsModuleConfig({
        hash,
        provider
      })
      .pipe(
        take(1),
        tap((em: ExternalModuleConfiguration) =>
          console.log(
            `Plugin loaded: ${em.name} hash: ${this.defaultIpfsProvider}${hash}`
          )
        ),
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
        map(data => {
          const currentModule = this.loadModule(data);
          this.hashCache[hash] = currentModule;
          console.log(currentModule.metadata.moduleHash);
          return currentModule;
        })
      );
  }

  private loadModule(m: any): { metadata: Metadata } {
    return m[Object.keys(m)[0]];
  }

  loadPlugins(
    ipfsHashes: string[] = [],
    pluginsFolder: string = GAPI_DAEMON_PLUGINS_FOLDER
  ) {
    return this.fileService.mkdirp(pluginsFolder).pipe(
      switchMap(() => this.fileService.fileWalker(pluginsFolder)),
      switchMap(p =>
        Promise.all(
          [...new Set(p)]
            .map(async path =>
              !new RegExp(/^(.(?!.*\.js$))*$/g).test(path)
                ? await this.loadModule(require(path))
                : null
            )
            .filter(p => !!p)
        )
      ),
      switchMap(pluginModules =>
        of(null).pipe(
          combineLatest(
            [...new Set(ipfsHashes)].map(hash => this.getModule(hash))
          ),
          map(externalModules => [
            ...new Set([...externalModules, ...pluginModules])
          ]),
          map(m => m.filter(i => !!i))
        )
      )
    );
  }
}
