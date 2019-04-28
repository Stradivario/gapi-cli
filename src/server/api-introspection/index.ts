// tslint:disable
// graphql typescript definitions


  export interface IGraphQLResponseRoot {
    data?: IQuery | ISubscription;
    errors?: Array<IGraphQLResponseError>;
  }

  export interface IGraphQLResponseError {
    message: string;            // Required for all errors
    locations?: Array<IGraphQLResponseErrorLocation>;
    [propName: string]: any;    // 7.2.2 says 'GraphQL servers may provide additional entries to error'
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
}

  
  export interface IStatusQueryType {
    __typename?: "StatusQueryType";
    status: string | null;
}

  /**
    description: Subscription type for all subscriptions via pub sub
  */
  export interface ISubscription {
    __typename?: "Subscription";
    statusSubscription: ISubscriptionStatusType | null;
}

  
  export interface ISubscriptionStatusType {
    __typename?: "SubscriptionStatusType";
    status: string | null;
}


// tslint:enable
