"use strict";
/*
 * Copyright 2020 Google Inc. All Rights Reserved.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateConfig = updateConfig;
const core_1 = require("@bubblewrap/core");
const fs_1 = require("fs");
const config_1 = require("../config");
const config_2 = require("../config");
const strings_1 = require("../strings");
async function updateAndroidSdkPath(path, log) {
    if (!(0, fs_1.existsSync)(path)) {
        log.error('Please enter a valid path.');
        return false;
    }
    const config = await (0, config_1.loadOrCreateConfig)();
    const jdkPath = config.jdkPath;
    const newConfig = new core_1.Config(jdkPath, path);
    await newConfig.saveConfig(config_2.DEFAULT_CONFIG_FILE_PATH);
    return true;
}
async function updateJdkPath(path, log) {
    if (!(0, fs_1.existsSync)(path)) {
        log.error('Please enter a valid path.');
        return false;
    }
    const config = await (0, config_1.loadOrCreateConfig)();
    const androidSdkPath = config.androidSdkPath;
    const newConfig = new core_1.Config(path, androidSdkPath);
    await newConfig.saveConfig(config_2.DEFAULT_CONFIG_FILE_PATH);
    return true;
}
async function updateConfig(args, log = new core_1.ConsoleLog('updateConfig')) {
    if (args.jdkPath) {
        await updateJdkPath(args.jdkPath, log);
    }
    if (args.androidSdkPath) {
        await updateAndroidSdkPath(args.androidSdkPath, log);
    }
    if (!args.jdkPath && !args.androidSdkPath) {
        log.error(strings_1.enUS.updateConfigUsage);
        return false;
    }
    return true;
}
