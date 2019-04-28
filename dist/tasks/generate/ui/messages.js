"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const emojis_1 = require("./emojis");
exports.messages = {
    DRY_RUN_MODE: 'Command has been executed in the dry mode, nothing changed!',
    PROJECT_INFORMATION_START: `${emojis_1.emojis.ZAP}  We will scaffold your app in a few seconds..`,
    RUNNER_EXECUTION_ERROR: (command) => `Failed to execute command: ${command}`,
    PACKAGE_MANAGER_QUESTION: `Which package manager would you ${emojis_1.emojis.HEART}  to use?`,
    PACKAGE_MANAGER_INSTALLATION_IN_PROGRESS: `Installation in progress... ${emojis_1.emojis.COFFEE}`,
    PACKAGE_MANAGER_UPDATE_IN_PROGRESS: `Installation in progress... ${emojis_1.emojis.COFFEE}`,
    PACKAGE_MANAGER_UPGRADE_IN_PROGRESS: `Installation in progress... ${emojis_1.emojis.COFFEE}`,
    GIT_INITIALIZATION_ERROR: 'Git repository has not been initialized',
    PACKAGE_MANAGER_INSTALLATION_SUCCEED: (name) => `${emojis_1.emojis.ROCKET}  Successfully created project ${chalk_1.default.green(name)}`,
    GET_STARTED_INFORMATION: `${emojis_1.emojis.POINT_RIGHT}  Get started with the following commands:`,
    CHANGE_DIR_COMMAND: (name) => `$ cd ${name}`,
    START_COMMAND: (name) => `$ ${name} run start`,
    PACKAGE_MANAGER_INSTALLATION_FAILED: `${emojis_1.emojis.SCREAM}  Packages installation failed, see above`,
    NEST_INFORMATION_PACKAGE_MANAGER_FAILED: `${emojis_1.emojis.SMIRK}  cannot read your project package.json file, are you inside your project directory?`,
};
