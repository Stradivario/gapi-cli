#! /usr/bin/env node
import { Service, Container } from 'typedi';
import { ArgsService } from '../../core/services/args.service';
import { ExecService } from '../../core/services/exec.service';
import { SchematicRunner } from './runners/schematic.runner';
import { nextOrDefault } from '../../core/helpers/index';

@Service()
export class GenerateTask {
  private execService: ExecService = Container.get(ExecService);
  private argsService: ArgsService = Container.get(ArgsService);

  async run() {
    this.argsService.args.toString().includes('--advanced');
    var args = process.argv.slice(3);
    let method = '';
    let hasSpec = false;
    if (args[0] === 'c' || args[0] === 'controller') {
      method = 'controller';
      hasSpec = true;
    }
    if (args[0] === 's' || args[0] === 'service') {
      method = 'service';
      hasSpec = true;
    }

    if (args[0] === 'm' || args[0] === 'module') {
      method = 'module';
    }

    if (args[0] === 't' || args[0] === 'type') {
      method = 'type';
    }

    if (args[0] === 'p' || args[0] === 'provider') {
      method = 'provider';
    }

    if (args[0] === 's' || args[0] === 'service') {
      method = 'service';
    }

    if (args[0] === 'g' || args[0] === 'guard') {
      method = 'guard';
    }

    if (args[0] === 'i' || args[0] === 'interceptor') {
      method = 'interceptor';
    }
    if (!method) {
      throw new Error('Method not specified');
    }

    try {
      await new SchematicRunner().run(
        `@rxdi/schematics:${method} --name=${args[1]} --no-dry-run ${
          hasSpec ? '--spec' : ''
        } --language='ts' --sourceRoot='src'`
      );
    } catch (e) {
      console.log(e);
    }
  }

  async exec(repoLink: string, args = '') {
    await this.execService.call(
      `git clone ${repoLink} ${process.argv[3]} && cd ./${
        process.argv[3]
      } && npm install ${args ? `&& ${args}` : ''}`
    );
  }
}
