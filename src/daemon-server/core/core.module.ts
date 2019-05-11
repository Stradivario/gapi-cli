import { Module } from '@rxdi/core';
import { ListService } from './services/list.service';
import { DaemonService } from './services/daemon.service';
import { ChildService } from './services/child.service';
import { IpfsHashMapService } from './services/ipfs-hash-map.service';

@Module({
  services: [ListService, DaemonService, ChildService, IpfsHashMapService]
})
export class CoreModule {}
