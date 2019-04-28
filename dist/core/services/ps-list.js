'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const util = require('util');
const path = require('path');
const childProcess = require('child_process');
const TEN_MEGABYTES = 1000 * 1000 * 10;
const execFile = util.promisify(childProcess.execFile);
const windows = () => __awaiter(this, void 0, void 0, function* () {
    // Source: https://github.com/MarkTiedemann/fastlist
    const bin = path.join(__dirname, 'fastlist.exe');
    const { stdout } = yield execFile(bin, { maxBuffer: TEN_MEGABYTES });
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
const main = (options = { all: null }) => __awaiter(this, void 0, void 0, function* () {
    const flags = (options.all === false ? '' : 'a') + 'wwxo';
    const ret = {};
    yield Promise.all(['comm', 'args', 'ppid', 'uid', '%cpu', '%mem'].map((cmd) => __awaiter(this, void 0, void 0, function* () {
        const { stdout } = yield execFile('ps', [flags, `pid,${cmd}`], { maxBuffer: TEN_MEGABYTES });
        for (let line of stdout.trim().split('\n').slice(1)) {
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
        .filter(([, value]) => value.comm && value.args && value.ppid && value.uid && value['%cpu'] && value['%mem'])
        .map(([key, value]) => ({
        pid: Number.parseInt(key, 10),
        name: path.basename(value.comm),
        cmd: value.args,
        ppid: Number.parseInt(value.ppid, 10),
        uid: Number.parseInt(value.uid, 10),
        cpu: Number.parseFloat(value['%cpu']),
        memory: Number.parseFloat(value['%mem'])
    }));
});
exports.processList = process.platform === 'win32' ? windows : main;
