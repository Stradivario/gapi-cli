#! /usr/bin/env node
import { Container } from 'typedi';
import { RootService } from './core/services/root.service';
import { ArgsService } from './core/services/args.service';
import { ConfigService, GapiConfig } from './core/services/config.service';
import { load } from 'yamljs';
import chalk = require('chalk');
import * as figlet from 'figlet';

const rootService = Container.get(RootService);
const argsService = Container.get(ArgsService);
const configService = Container.get(ConfigService);
let config: any = {};
try {
    config = load('gapi-cli.conf.yml');
} catch (e) {
    console.error('Missing gapi-cli.conf.yml gapi-cli will be with malfunctioning.');
}
configService.setCustomConfig(config);
argsService.setArguments(process.argv);
rootService.runTask()
.then()
.catch(e => console.error(e));
console.log(chalk.default.yellow(
    figlet.textSync('Gapi', { horizontalLayout: 'full' })
  ));