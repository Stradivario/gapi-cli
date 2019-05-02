import { IQuery } from '../../../daemon-server/api-introspection';
export declare class DaemonExecutorService {
    daemonLink: string;
    getLinkList(): PromiseLike<import("@rxdi/graphql/dist/plugin-init").Response<IQuery>>;
}
