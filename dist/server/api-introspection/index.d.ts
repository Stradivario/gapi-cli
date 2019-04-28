export interface IGraphQLResponseRoot {
    data?: IQuery | ISubscription;
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
    getLinkList: Array<ILinkListType> | null;
}
export interface IStatusQueryType {
    __typename?: "StatusQueryType";
    status: string | null;
}
export interface ILinkListType {
    __typename?: "LinkListType";
    repoPath: string | null;
    introspectionPath: string | null;
    linkName: string | null;
}
/**
  description: Subscription type for all subscriptions via pub sub
*/
export interface ISubscription {
    __typename?: "Subscription";
    statusSubscription: ISubscriptionStatusType | null;
    serverRestarted: ISubscriptionStatusType | null;
}
export interface ISubscriptionStatusType {
    __typename?: "SubscriptionStatusType";
    status: string | null;
}
