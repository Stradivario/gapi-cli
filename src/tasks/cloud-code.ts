import { Service, Container } from '@rxdi/core';
import { spawn } from 'child_process';
import { ExecService } from '../core/services/exec.service';
import { nextOrDefault } from 'src/core/helpers';

@Service()
export class CloudCodeTask {
  execService: ExecService = Container.get(ExecService);
  async run() {
    await this.exec();
  }
  async exec() {
    this.execService.call('docker run -p 127.0.0.1:8443:8443 -p 127.0.0.1:1234:1234 -p 127.0.0.1:9000:9000 -v "${PWD}:/home/coder/project" codercom/code-server --allow-http --no-auth');
  }
}
