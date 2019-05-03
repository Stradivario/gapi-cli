import { CoreModuleConfig } from '@gapi/core';
import { PluginLoader } from '../daemon-server/core/services/plugin-loader.service';
export declare class BootstrapTask {
    private pluginLoader;
    constructor(pluginLoader: PluginLoader);
    run(options?: CoreModuleConfig): Promise<void>;
}
