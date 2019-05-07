export interface IGraphQLResponseRoot {
    data?: IQuery | IMutation | ISubscription;
    errors?: Array<IGraphQLResponseError>;
}
export interface IGraphQLResponseError {
    message: string;
    locations?: Array<IGraphQLResponseErrorLocation>;
    [propName: string]: any;
}
export interface IGraphQLResponseErrorLocation {
    line: number;
    column: number;
}
/**
  description: Query type for all get requests which will not change persistent data
*/
export interface IQuery {
    __typename?: "Query";
    status: IStatusQueryType | null;
    initQuery: ICustomControllerType | null;
    getLinkList: Array<ILinkListType> | null;
}
export interface IStatusQueryType {
    __typename?: "StatusQueryType";
    status: string | null;
}
export interface ICustomControllerType {
    __typename?: "CustomControllerType";
    init: string | null;
}
export interface ILinkListType {
    __typename?: "LinkListType";
    repoPath: string | null;
    introspectionPath: string | null;
    linkName: string | null;
    serverMetadata: IServerMetadataType | null;
}
export interface IServerMetadataType {
    __typename?: "ServerMetadataType";
    port: number | null;
}
/**
  description: Mutation type for all requests which will change persistent data
*/
export interface IMutation {
    __typename?: "Mutation";
    notifyDaemon: ILinkListType | null;
}
export interface IServerMetadataInputType {
    port?: number | null;
}
/**
  description: Subscription type for all subscriptions via pub sub
*/
export interface ISubscription {
    __typename?: "Subscription";
    statusSubscription: ILinkListType | null;
}
