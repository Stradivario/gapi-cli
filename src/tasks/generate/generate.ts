import { Service } from '@rxdi/core';
import { SchematicRunner } from './runners/schematic.runner';
import { nextOrDefault, includes } from '../../core/helpers/index';

@Service()
export class GenerateTask {

  async run() {
    const dryRun = includes('--dry-run');
    const force = includes('--force');
    let internalArguments = '';
    var args = process.argv.slice(3);
    let method = '';
    let sourceRoot = nextOrDefault('--source-root', 'src');
    let language = nextOrDefault('--language', 'ts');

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
    if (args[0] === 'e' || args[0] === 'effect') {
      method = 'effect';
    }

    if (args[0] === 'e' || args[0] === 'effect') {
      method = 'effect';
    }

    if (args[0] === 'pg' || args[0] === 'plugin') {
      method = 'plugin';
      internalArguments = `--method=${nextOrDefault('--method', 'GET')}`;
    }
    if (!method) {
      throw new Error('Method not specified');
    }

    try {
      await new SchematicRunner().run(
        `@rxdi/schematics:${method} --name=${args[1]} --force=${force} --dryRun=${dryRun} ${
          hasSpec ? '--spec' : ''
        } --language='${language}' --sourceRoot='${sourceRoot}' ${internalArguments}`
      );
    } catch (e) {
      console.log(e);
    }
  }
}
