export declare type GapiCommands = '--dry-run' | '--name' | '--spec' | '--no-dry-run' | '--sourceRoot';
export declare const includes: (i: GapiCommands) => boolean;
export declare const nextOrDefault: (i: any, fb?: any, type?: (p: any) => any) => any;
