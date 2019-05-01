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
import { Observable, from, of, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
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
    return from(this.listService.readList()).pipe(
      switchMap(list =>
        list.length
          ? this.listService.findByRepoPath(payload.repoPath)
          : of([] as ILinkListType[])
      ),
      switchMap(([repo]) => {
        if (repo && repo.linkName) {
          return this.listService.findByLinkName(repo.linkName, repo.repoPath);
        }
        return of([] as ILinkListType[]);
      }),
      switchMap(otherRepos =>
        combineLatest([
          this.daemonService.trigger(payload),
          ...otherRepos.map(r => this.daemonService.trigger(r))
        ])
      ),
      map(() => payload)
    );
  }
}
