#! /usr/bin/env node
import { exec } from 'shelljs';
import { Container, Service } from 'typedi';
import { RootService } from './core/services/root.service';
import { ArgsService } from './core/services/args.service';
import { ConfigService } from './core/services/config.service';
import { readFileSync } from 'fs';

const rootService = Container.get(RootService);
const argsService = Container.get(ArgsService);
const configService = Container.get(ConfigService);
let config;
try {
    config = readFileSync(`${process.cwd()}/gapi-cli.conf.json`, 'utf8');
    configService.setCustomConfig(JSON.parse(config));
} catch (e) {}
argsService.setArguments(process.argv);
rootService.runTask();