import { ILinkListType } from '../../api-introspection';
export declare class DaemonService {
    trigger(payload: ILinkListType): Promise<ILinkListType>;
    writeGapiCliConfig(gapiLocalConfig: string): Promise<void>;
}
