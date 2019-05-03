import { homedir } from "os";

export const GAPI_MAIN_FOLDER = `${homedir()}/.gapi`;
export const GAPI_DAEMON_FOLDER = `${GAPI_MAIN_FOLDER}/daemon`;
export const GAPI_DAEMON_PROCESS_LIST_FOLDER = `${GAPI_DAEMON_FOLDER}/process-list`;
export const GAPI_DAEMON_PLUGINS_FOLDER = `${GAPI_DAEMON_FOLDER}/plugins`;
export const GAPI_DAEMON_EXTERNAL_PLUGINS_FOLDER = `${GAPI_DAEMON_FOLDER}/external-plugins`;
export const GAPI_DAEMON_CACHE_FOLDER = `${GAPI_DAEMON_FOLDER}/.cache`;