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
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = update;
const Prompt_1 = require("../Prompt");
const strings_1 = require("../strings");
const shared_1 = require("./shared");
/**
 * Updates an existing TWA Project using the `twa-manifest.json`.
 * @param {string} [args.manifest] directory where the command should look for the
 * `twa-manifest.json`. Defaults to the current folder.
 * @param {boolean} [args.skipVersionUpgrade] Skips upgrading appVersionCode and appVersionName
 * if set to true.
 * @param {string} [args.appVersionName] Value to be used for appVersionName when upgrading
 * versions. Ignored if `args.skipVersionUpgrade` is set to true.
 */
async function update(args, prompt = new Prompt_1.InquirerPrompt()) {
    const targetDirectory = args.directory;
    const manifestFile = args.manifest;
    const updated = await (0, shared_1.updateProject)(args.skipVersionUpgrade, args.appVersionName, prompt, targetDirectory, manifestFile);
    if (updated) {
        prompt.printMessage(strings_1.enUS.messageProjectBuildReminder);
    }
    return updated;
}
