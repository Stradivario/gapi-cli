import {
  Injectable,
  ExternalImporter,
  ExternalModuleConfiguration,
  FileService,
  Metadata
} from '@rxdi/core';
import { Observable } from 'rxjs';
import { take, switchMap, map, combineLatest, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { homedir } from 'os';

@Injectable()
export class PluginLoader {

  hashCache: { [key: string]: { metadata: Metadata} } = {};
  defaultPluginsFolder = `${homedir()}/.gapi/daemon/plugins`;
  defaultExternalPluginsFolder = '/plugins/';
  defaultIpfsProvider = 'https://ipfs.io/ipfs/';
  defaultDownloadFilename = 'gapi-plugin';

  constructor(
    private externalImporterService: ExternalImporter,
    private fileService: FileService
  ) {}
  getModule = (hash: string, provider: string = this.defaultIpfsProvider) => {
    if (this.hashCache[hash]) {
      return this.hashCache[hash];
    }
    return new Observable(o => {
      this.externalImporterService
        .downloadIpfsModuleConfig({
          hash,
          provider
        })
        .pipe(
          take(1),
          tap((em: ExternalModuleConfiguration) => console.log(`Plugin loaded: ${em.name} hash: ${this.defaultIpfsProvider}${hash}`)),
          switchMap((externalModule: ExternalModuleConfiguration) =>
            this.externalImporterService.importModule(
              {
                fileName: this.defaultDownloadFilename,
                namespace: externalModule.name,
                extension: 'js',
                outputFolder: this.defaultExternalPluginsFolder,
                link: `${this.defaultIpfsProvider}${externalModule.module}`
              },
              externalModule.name
            )
          ),
        )
        
        .subscribe(
          data => {
            const currentModule = this.loadModule(data);
            this.hashCache[hash] = currentModule
            console.log(currentModule.metadata.moduleHash)
            o.next(currentModule);
            o.complete();
          },
          e => {
            o.error(e);
            o.complete();
          }
        );
    });
  };

  private loadModule(m: any): { metadata: Metadata } {
    return m[Object.keys(m)[0]]
  }

  loadPlugins(modules: string[] = [], pluginsFolder: string = this.defaultPluginsFolder) {
    let plugins = of([]);
    if (this.fileService.isPresent(pluginsFolder)) {
      plugins = this.fileService.fileWalker(pluginsFolder);
    }
    return plugins.pipe(
      map(p => {
        return [...new Set(p)]
          .map(path => {
            if (!(new RegExp(/^(.(?!.*\.js$))*$/g).test(path))) {
              return this.loadModule(require(path));
            }
          })
          .filter(p => !!p);
      }),
      switchMap(pluginModules =>
        of(null).pipe(
          combineLatest([...new Set(modules)].map(hash => this.getModule(hash))),
          map(externalModules => [...new Set([...externalModules, ...pluginModules])]),
          map(m => m.filter(i => !!i))
        )
      )
    );
  }
}
