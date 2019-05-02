import { Module } from '@rxdi/core';
import { ListService } from './services/list.service';
import { DaemonService } from './services/daemon.service';
import { ChildService } from './services/child.service';

@Module({
  services: [ListService, DaemonService, ChildService]
})
export class CoreModule {}
