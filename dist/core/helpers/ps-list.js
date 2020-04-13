'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const path_1 = require("path");
const child_process_1 = require("child_process");
const TEN_MEGABYTES = 1000 * 1000 * 10;
const windows = () => __awaiter(void 0, void 0, void 0, function* () {
    // Source: https://github.com/MarkTiedemann/fastlist
    const bin = path_1.join(__dirname, 'fastlist.exe');
    const { stdout } = yield util_1.promisify(child_process_1.execFile)(bin, {
        maxBuffer: TEN_MEGABYTES
    });
    return stdout
        .trim()
        .split('\r\n')
        .map(line => line.split('\t'))
        .map(([name, pid, ppid]) => ({
        name,
        pid: Number.parseInt(pid, 10),
        ppid: Number.parseInt(ppid, 10)
    }));
});
const main = (options = { all: null }) => __awaiter(void 0, void 0, void 0, function* () {
    const flags = (options.all === false ? '' : 'a') + 'wwxo';
    const ret = {};
    yield Promise.all(['comm', 'args', 'ppid', 'uid', '%cpu', '%mem'].map((cmd) => __awaiter(void 0, void 0, void 0, function* () {
        const { stdout } = yield util_1.promisify(child_process_1.execFile)('ps', [flags, `pid,${cmd}`], { maxBuffer: TEN_MEGABYTES });
        for (let line of stdout
            .trim()
            .split('\n')
            .slice(1)) {
            line = line.trim();
            const [pid] = line.split(' ', 1);
            const val = line.slice(pid.length + 1).trim();
            if (ret[pid] === undefined) {
                ret[pid] = {};
            }
            ret[pid][cmd] = val;
        }
    })));
    // Filter out inconsistencies as there might be race
    // issues due to differences in `ps` between the spawns
    return Object.entries(ret)
        .filter(([, value]) => value.comm &&
        value.args &&
        value.ppid &&
        value.uid &&
        value['%cpu'] &&
        value['%mem'])
        .map(([key, value]) => ({
        pid: Number.parseInt(key, 10),
        name: path_1.basename(value.comm),
        cmd: value.args,
        ppid: Number.parseInt(value.ppid, 10),
        uid: Number.parseInt(value.uid, 10),
        cpu: Number.parseFloat(value['%cpu']),
        memory: Number.parseFloat(value['%mem'])
    }));
});
exports.getProcessList = process.platform === 'win32' ? windows : main;
