"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = require("os");
exports.GAPI_MAIN_FOLDER = `${os_1.homedir()}/.gapi`;
exports.GAPI_DAEMON_FOLDER = `${exports.GAPI_MAIN_FOLDER}/daemon`;
exports.GAPI_DAEMON_PROCESS_LIST_FOLDER = `${exports.GAPI_DAEMON_FOLDER}/process-list`;
exports.GAPI_DAEMON_PLUGINS_FOLDER = `${exports.GAPI_DAEMON_FOLDER}/plugins`;
exports.GAPI_DAEMON_EXTERNAL_PLUGINS_FOLDER = `${exports.GAPI_DAEMON_FOLDER}/external-plugins`;
exports.GAPI_DAEMON_CACHE_FOLDER = `${exports.GAPI_DAEMON_FOLDER}/.cache`;
