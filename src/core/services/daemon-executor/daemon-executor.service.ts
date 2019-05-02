import { Service } from '@rxdi/core';
import { sendRequest } from '@rxdi/graphql';
import { IQuery } from '../../../daemon-server/api-introspection';

@Service()
export class DaemonExecutorService {
  daemonLink: string = 'http://localhost:42000/graphql';
  getLinkList() {
    return sendRequest<IQuery>(
      {
        query: `
              query {
                getLinkList {
                  repoPath
                  introspectionPath
                  linkName
                  serverMetadata {
                    port
                  }
                }
              }
            `
      },
      this.daemonLink
    );
  }
}
