import { InterceptResolver, GenericGapiResolversType } from '@gapi/core';
import { Observable } from 'rxjs';
import { ILinkListType } from '../../../daemon-server/api-introspection';
export declare class NotifyInterceptor implements InterceptResolver {
    intercept(chainable$: Observable<any>, context: any, payload: ILinkListType, descriptor: GenericGapiResolversType): Observable<any>;
}
