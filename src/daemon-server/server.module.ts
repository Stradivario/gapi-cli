import { Module } from '@gapi/core';
import { ServerController } from './server.controller';
import { CoreModule } from './core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [ServerController]
})
export class ServerModule {}
