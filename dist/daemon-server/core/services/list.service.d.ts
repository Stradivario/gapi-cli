import { ILinkListType } from '../../api-introspection/index';
export declare class ListService {
    private linkedList;
    readList(): Promise<ILinkListType[]>;
    findByRepoPath(repoPath: string): Promise<ILinkListType[]>;
    findByLinkName(linkName: string): {
        results: () => Promise<ILinkListType[]>;
        exclude: (isNotLike: string) => Promise<ILinkListType[]>;
    };
}
