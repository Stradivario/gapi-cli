export declare type Tasks = '--inspect' | '--iport' | '--ihost' | '--buildOnly=false' | '--minify=false' | '--start' | '--outDir' | '--outFile' | '--hmr' | '--public-url' | '--glob' | 'add' | '--lint' | 'clean' | 'restart' | 'list' | '--url' | '--folder' | '--pattern' | '--all' | '--link-name' | 'start' | 'status' | 'unlink' | 'link' | 'bootstrap' | '--dry-run' | '--force' | '--source-root' | '--language' | '--schematics-name' | '--method' | 'remove' | 'kill' | 'stop' | '--port' | '--bundle-modules' | '--disable-excluded-folders' | '--inspect-brk' | '--target=browser';
export declare const includes: (i: Tasks) => boolean;
export declare const nextOrDefault: (i: Tasks, fb?: any, type?: (p: any) => any) => any;
export * from './systemd-daemon';
