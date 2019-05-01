import { Service } from '@rxdi/core';
import { sendRequest } from '@rxdi/graphql';

@Service()
export class DaemonExecutorService {
    daemonLink: string = 'http://localhost:42000/graphql';
    getLinkList() {
        return sendRequest<any>({
            query: `
              query {
                getLinkList {
                  repoPath
                  introspectionPath
                  linkName
                }
              }
            `
          }, this.daemonLink)
    }
}