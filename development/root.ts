#! /usr/bin/env node
import { exec } from 'shelljs';
import { Container, Service } from 'typedi';
import { RootService } from './core/services/root.service';
import { ArgsService } from './core/services/args.service';

const rootService = Container.get(RootService);
const argsService = Container.get(ArgsService);

argsService.setArguments(process.argv);
rootService.runTask();