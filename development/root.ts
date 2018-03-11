#! /usr/bin/env node
import { exec } from 'shelljs';
import { Container, Service } from 'typedi';
import { RootService } from './core/services/root.service';
import { ArgsService } from './core/services/args.service';
import { ConfigService } from './core/services/config.service';
import { readFileSync } from 'fs';
import { load } from 'yamljs';

const rootService = Container.get(RootService);
const argsService = Container.get(ArgsService);
const configService = Container.get(ConfigService);
let config;
try {
    config = load('gapi-cli.conf.yml');
    configService.setCustomConfig(config);
} catch (e) {}
argsService.setArguments(process.argv);
rootService.runTask();