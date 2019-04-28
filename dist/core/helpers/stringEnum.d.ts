export declare function strEnum<T extends string>(o: Array<T>): {
    [K in T]: K;
};
