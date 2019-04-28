import { Module } from "@rxdi/core";
import { ListService } from "./services/list.service";

@Module({
    services: [ListService]
})
export class CoreModule {}