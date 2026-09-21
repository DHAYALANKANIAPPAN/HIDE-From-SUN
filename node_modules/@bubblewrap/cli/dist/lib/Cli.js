"use strict";
/*
 * Copyright 2019 Google Inc. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cli = void 0;
const minimist_1 = __importDefault(require("minimist"));
const update_1 = require("./cmds/update");
const help_1 = require("./cmds/help");
const build_1 = require("./cmds/build");
const init_1 = require("./cmds/init");
const validate_1 = require("./cmds/validate");
const install_1 = require("./cmds/install");
const config_1 = require("./config");
const semver_1 = require("semver");
const version_1 = require("./cmds/version");
const constants_1 = require("./constants");
const updateConfig_1 = require("./cmds/updateConfig");
const doctor_1 = require("./cmds/doctor");
const merge_1 = require("./cmds/merge");
const fingerprint_1 = require("./cmds/fingerprint");
const core_1 = require("@bubblewrap/core");
const play_1 = require("./cmds/play");
class Cli {
    async run(args) {
        console.log(constants_1.BUBBLEWRAP_LOGO);
        if ((0, semver_1.major)(process.versions.node) < 14) {
            throw new Error(`Current Node.js version is ${process.versions.node}.` +
                ' Node.js version 14 or above is required to run Bubblewrap.');
        }
        const parsedArgs = (0, minimist_1.default)(args);
        if (parsedArgs.fetchEngine &&
            (parsedArgs.fetchEngine == 'node-fetch' || parsedArgs.fetchEngine == 'fetch-h2')) {
            core_1.fetchUtils.setFetchEngine(parsedArgs.fetchEngine);
        }
        const config = await (0, config_1.loadOrCreateConfig)(undefined, undefined, parsedArgs.config);
        let command;
        if (parsedArgs._.length === 0) {
            // Accept --version and --help alternatives for the help and version commands.
            if (parsedArgs.version) {
                command = 'version';
            }
            else if (parsedArgs.help) {
                command = 'help';
            }
        }
        else {
            command = parsedArgs._[0];
        }
        // If no command is given, default to 'help'.
        if (!command) {
            command = 'help';
        }
        switch (command) {
            case 'help':
                return await (0, help_1.help)(parsedArgs);
            case 'init':
                return await (0, init_1.init)(parsedArgs, config);
            case 'update':
                return await (0, update_1.update)(parsedArgs);
            case 'build':
                return await (0, build_1.build)(config, parsedArgs);
            case 'validate':
                return await (0, validate_1.validate)(parsedArgs);
            case 'version': {
                return await (0, version_1.version)();
            }
            case 'install':
                return await (0, install_1.install)(parsedArgs, config);
            case 'updateConfig':
                return await (0, updateConfig_1.updateConfig)(parsedArgs);
            case 'doctor':
                return await (0, doctor_1.doctor)();
            case 'merge':
                return await (0, merge_1.merge)(parsedArgs);
            case 'fingerprint':
                return await (0, fingerprint_1.fingerprint)(parsedArgs);
            case 'play':
                return await (0, play_1.play)(parsedArgs);
            default:
                throw new Error(`"${command}" is not a valid command! Use 'bubblewrap help' for a list of commands`);
        }
    }
}
exports.Cli = Cli;
