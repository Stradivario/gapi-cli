import {
  Controller,
  PubSubService,
  Subscribe,
  Subscription,
  Type,
  Query,
  GraphQLList,
  Mutation,
  GraphQLString
} from '@gapi/core';
import { SubscriptionStatusType } from './server.type';
import { ListService } from './core/services/list.service';
import { LinkListType } from './types/link-list.type';
import { spawn } from 'child_process';
import { promisify } from 'util';
import { exists } from 'fs';

@Controller()
export class ServerController {
  constructor(private pubsub: PubSubService, private listService: ListService) {
    let count = 0;
    setInterval(() => {
      count++;
      pubsub.publish('CREATE_SIGNAL_BASIC', `AZ${count}`);
    }, 2000);
  }

  @Type(SubscriptionStatusType)
  @Subscribe((self: ServerController) =>
    self.pubsub.asyncIterator('CREATE_SIGNAL_BASIC')
  )
  @Subscription()
  statusSubscription(message) {
    return {
      status: message
    };
  }

  @Type(SubscriptionStatusType)
  @Subscribe((self: ServerController) =>
    self.pubsub.asyncIterator('CREATE_SIGNAL_BASIC')
  )
  @Subscription()
  serverRestarted(message) {
    return {
      status: message
    };
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
  notifyDaemon(root, payload) {
    return new Promise(async (resolve, reject) => {
      const args = ['schema', 'introspect', '--collect-documents', '--collect-types'];
      const gapiLocalConfig = `${payload.repoPath}/gapi-cli.conf.yml`;
      if (!await promisify(exists)(gapiLocalConfig)) {
        args.push(`--url http://localhost:9000/graphql`);
        args.push(`--folder ./api-introspection`);
      }
      const child = spawn(
        'gapi',
        args,
        {
          cwd: payload.repoPath
        }
      );
      child.stdout.on('data', data => {
        process.stdout.write(data);
        if (
          data
            .toString('utf8')
            .includes(
              'Typings introspection based on GAPI Schema created inside folder'
            )
        ) {
          resolve(payload);
        }
      });

      child.stderr.on('data', data => {
        process.stderr.write(data);
      });

      child.on('close', code => {
        // console.log(`child process exited with code ${code}`);
        resolve(payload);
      });
    });
  }
}
