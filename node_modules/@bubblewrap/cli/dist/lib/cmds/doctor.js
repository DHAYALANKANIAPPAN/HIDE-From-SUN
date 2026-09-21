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
exports.doctor = doctor;
const core_1 = require("@bubblewrap/core");
const config_1 = require("../config");
const strings_1 = require("../strings");
async function jdkDoctor(config, log) {
    const result = await core_1.JdkHelper.validatePath(config.jdkPath);
    if (result.isError()) {
        if (result.unwrapError().getErrorCode() === 'PathIsNotCorrect') {
            log.error(strings_1.enUS.jdkPathIsNotCorrect);
            return false;
        }
        else if (result.unwrapError().getErrorCode() === 'PathIsNotSupported') {
            log.error(strings_1.enUS.jdkIsNotSupported);
            return false;
        }
        else { // Error while reading the file, will print the error message.
            log.error(result.unwrapError().message);
            return false;
        }
    }
    return true;
}
async function androidSdkDoctor(config, log) {
    if ((await core_1.AndroidSdkTools.validatePath(config.androidSdkPath)).isError()) {
        log.error(strings_1.enUS.androidSdkPathIsNotCorrect);
        return false;
    }
    ;
    return true;
}
async function doctor(log = new core_1.ConsoleLog('doctor'), configPath) {
    const config = await (0, config_1.loadOrCreateConfig)(log, undefined, configPath);
    const jdkResult = await jdkDoctor(config, log);
    const androidSdkResult = await androidSdkDoctor(config, log);
    if (jdkResult && androidSdkResult) {
        log.info(strings_1.enUS.bothPathsAreValid);
    }
    return jdkResult && androidSdkResult;
}
