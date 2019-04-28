import { ILinkListType } from '../../api-introspection/index';
export declare class ListService {
    private linkedList;
    private gapiFolder;
    private daemonFolder;
    private processListFile;
    readList(): Promise<ILinkListType[]>;
}
