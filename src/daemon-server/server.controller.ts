import {
  Controller,
  PubSubService,
  Type,
  Query,
  GraphQLList,
  Mutation,
  GraphQLString
} from '@gapi/core';
import { ListService } from './core/services/list.service';
import { LinkListType } from './types/link-list.type';
import { ILinkListType } from './api-introspection';
import { DaemonService } from './core/services/daemon.service';
import { Observable } from 'rxjs';
import { ServerMetadataInputType } from './types/server-metadata.type';

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
  @Mutation({
    repoPath: {
      type: GraphQLString
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
