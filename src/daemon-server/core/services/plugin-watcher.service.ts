import { Injectable, FileService } from '@rxdi/core';
import { watch } from 'chokidar';
import {
  GAPI_DAEMON_EXTERNAL_PLUGINS_FOLDER,
  GAPI_DAEMON_PLUGINS_FOLDER
} from '../../daemon.config';
import { ChildService } from './child.service';
import { Observable } from 'rxjs';

@Injectable()
export class PluginWatcherService {
  constructor(
      private childService: ChildService,
      private fileService: FileService
    ) {}

  watch() {

    return new Observable<string[]>(observer => {
      const initPlugins: string[] = [];
      let isInitFinished = false;
      const watcher = watch(
        [
          `${GAPI_DAEMON_EXTERNAL_PLUGINS_FOLDER}/**/*.js`,
          `${GAPI_DAEMON_PLUGINS_FOLDER}/**/*.js`
        ],
        {
          ignored: /^\./,
          persistent: true
        }
      );
      watcher
        .on('add', (path: string) => {
          console.log('Plugin', path, 'has been added');
          if (!path.includes('external-plugins')) {
              initPlugins.push(path);
          }
          if (isInitFinished) {
            this.restartDaemon();
          }
        })
        .on('change', (path: string) => {
          console.log('File', path, 'has been changed');
        //   if (isInitFinished) {
        //     this.restartDaemon();
        //   }
        })
        .on('ready', () => {
          console.log('Initial scan complete. Ready for changes');
          isInitFinished = true;
          observer.next(initPlugins);
          observer.complete();
        })
        .on('unlink', path => {
          console.log('File', path, 'has been removed');
          if (isInitFinished) {
            this.restartDaemon();
          }
        })
        .on('error', error => console.error('Error happened', error));
    });
  }


  private async restartDaemon() {
    await this.childService.spawn(
      'gapi',
      ['daemon', 'restart'],
      process.cwd()
    );
    process.exit();
  }
}
