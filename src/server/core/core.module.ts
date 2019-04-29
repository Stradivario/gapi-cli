import { Module } from "@rxdi/core";
import { ListService } from "./services/list.service";
import { DaemonService } from "./services/daemon.service";

@Module({
    services: [ListService, DaemonService]
})
export class CoreModule {}