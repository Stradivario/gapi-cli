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

@Controller()
export class ServerController {
  constructor(
    private listService: ListService,
    private daemonService: DaemonService
    ) {
    let count = 0;
    setInterval(() => {
      count++;
      // pubsub.publish('CREATE_SIGNAL_BASIC', `AZ${count}`);
    }, 2000);
  }

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
    }
  })
  async notifyDaemon(root, payload: ILinkListType): Promise<ILinkListType> {
    if ((await this.listService.readList()).length) {
      const [repo] = await this.listService.findByRepoPath(payload.repoPath);
      let repoLinkedName: string = repo.linkName;
      const otherRepos = this.listService.findByLinkName(repoLinkedName, repo.repoPath);
      console.log(otherRepos);
    }
    return await this.daemonService.trigger(payload)
  }
}
