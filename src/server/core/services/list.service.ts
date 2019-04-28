import { Injectable } from "@rxdi/core";

export interface LinkedList {
    repoPath: string;
    introspectionPath: string;
    linkName: string;
}

@Injectable()
export class ListService {
    linkedList: LinkedList[] = []
}