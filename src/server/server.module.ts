import { Module } from "@gapi/core";
import { ServerController } from "./server.controller";

@Module({
    controllers: [ServerController]
})
export class ServerModule {}