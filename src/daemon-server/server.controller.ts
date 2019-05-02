import {
  Controller,
  PubSubService,
  Type,
  Query,
  GraphQLList,
  Mutation,
  GraphQLString,
  GraphQLNonNull,
  Interceptor
} from '@gapi/core';
import { ListService } from './core/services/list.service';
import { LinkListType } from './types/link-list.type';
import { ILinkListType } from './api-introspection';
import { DaemonService } from './core/services/daemon.service';
import { Observable } from 'rxjs';
import { ServerMetadataInputType } from './types/server-metadata.type';
import { NotifyInterceptor } from './core/interceptors/notify.interceptor';

@Controller()
export class ServerController {
  constructor(
    private listService: ListService,
    private daemonService: DaemonService
  ) {}

  @Type(new GraphQLList(LinkListType))
  @Query()
  getLinkList() {
    return this.listService.readList();
  }

  @Type(LinkListType)
  @Interceptor(NotifyInterceptor)
  @Mutation({
    repoPath: {
      type: new GraphQLNonNull(GraphQLString)
    },
    introspectionPath: {
      type: GraphQLString
    },
    linkName: {
      type: GraphQLString
    },
    serverMetadata: {
      type: ServerMetadataInputType
    }
  })
  notifyDaemon(root, payload: ILinkListType): Observable<ILinkListType> {
    return this.daemonService.notifyDaemon(payload);
  }
}
