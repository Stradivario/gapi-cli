#! /usr/bin/env node
import { Container, Service } from "typedi";
import { ConfigService, MainConfig } from "../core/services/config.service";
import { existsSync } from "fs";
import { StartTask } from "./start";

@Service()
export class BuildTask {
  private startTask = Container.get(StartTask);
  private configService: ConfigService = Container.get(ConfigService);

  async run() {
    const cwd = process.cwd();
    const customPath = process.argv[4]
      ? process.argv[4].split("--path=")[1]
      : null;
    const customPathExists = existsSync(`${cwd}/${customPath}`);
    this.startTask.prepareBundler(
      `${
        customPathExists
          ? `${cwd}/${customPathExists ? customPath : "index.ts"}`
          : `${cwd}/src/main.ts`
      }`,
      {
        original: this.configService.config.config.app.local,
        schema: this.configService.config.config.schema
      }
    );
  }
}
