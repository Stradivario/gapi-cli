import { Injectable } from '@rxdi/core';
import { promisify } from 'util';
import { readFile } from 'fs';
import { homedir } from 'os';
import { ILinkListType } from '../../api-introspection/index';

@Injectable()
export class ListService {
    private linkedList: ILinkListType[] = [];
    private gapiFolder: string = `${homedir()}/.gapi`;
    private daemonFolder: string = `${this.gapiFolder}/daemon`;
    private processListFile: string = `${this.daemonFolder}/process-list`;

    async readList() {
        try {
          this.linkedList = JSON.parse(await promisify(readFile)(this.processListFile, {
            encoding: 'utf-8'
          }))
        } catch (e) {}
        return this.linkedList
    }

}