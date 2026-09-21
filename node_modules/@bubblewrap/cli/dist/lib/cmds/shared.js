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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTwaProject = generateTwaProject;
exports.updateVersions = updateVersions;
exports.computeChecksum = computeChecksum;
exports.generateManifestChecksumFile = generateManifestChecksumFile;
exports.updateProject = updateProject;
const crypto = __importStar(require("crypto"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const Prompt_1 = require("../Prompt");
const strings_1 = require("../strings");
const constants_1 = require("../constants");
const cli_progress_1 = require("cli-progress");
const core_1 = require("@bubblewrap/core");
const core_2 = require("@bubblewrap/core");
const colors_1 = require("colors");
const inputHelpers_1 = require("../inputHelpers");
/**
 * Wraps generating a project with a progress bar.
 */
async function generateTwaProject(prompt, twaGenerator, targetDirectory, twaManifest) {
    prompt.printMessage(strings_1.enUS.messageGeneratingAndroidProject);
    const progressBar = new cli_progress_1.Bar({
        format: ` >> [${(0, colors_1.green)('{bar}')}] {percentage}%`,
    }, cli_progress_1.Presets.shades_classic);
    progressBar.start(100, 0);
    const progress = (current, total) => {
        progressBar.update(current / total * 100);
    };
    const log = new core_1.BufferedLog(new core_1.ConsoleLog('Generating TWA'));
    await twaGenerator.createTwaProject(targetDirectory, twaManifest, log, progress);
    progressBar.stop();
    log.flush();
}
/**
 * Compute the new app version.
 * @param {TwaManifest} oldTwaManifest current Twa Manifest.
 * @param {string | null} currentAppVersionName the current app's version name (or null) .
 * @param {Prompt} prompt prompt instance to get information from the user if needed.
 */
async function updateVersions(twaManifest, currentAppVersionName, prompt = new Prompt_1.InquirerPrompt()) {
    const previousAppVersionCode = twaManifest.appVersionCode;
    const appVersionCode = twaManifest.appVersionCode + 1;
    // If a version was passed as parameter, use it.
    if (currentAppVersionName) {
        return {
            appVersionCode: appVersionCode,
            appVersionName: currentAppVersionName,
        };
    }
    // Otherwise, try to upgrade automatically with the versionCode.
    if (twaManifest.appVersionName === previousAppVersionCode.toString()) {
        return {
            appVersionCode: appVersionCode,
            appVersionName: appVersionCode.toString(),
        };
    }
    // If not not possible, ask the user to input a new version.
    const appVersionName = await prompt.promptInput(strings_1.enUS.promptNewAppVersionName, null, (0, inputHelpers_1.createValidateString)(1));
    return {
        appVersionCode: appVersionCode,
        appVersionName: appVersionName,
    };
}
function computeChecksum(data) {
    return crypto.createHash('sha1').update(data).digest('hex');
}
async function generateManifestChecksumFile(manifestFile, targetDirectory) {
    const manifestContents = await fs.promises.readFile(manifestFile);
    const checksumFile = path.join(targetDirectory, 'manifest-checksum.txt');
    const sum = computeChecksum(manifestContents);
    await fs.promises.writeFile(checksumFile, sum);
}
/**
 * Update the TWA project.
 * @param skipVersionUpgrade {boolean} Skips upgrading appVersionCode and appVersionName if set to true.
 * @param appVersionName {string | null} Value to be used for appVersionName when upgrading
 * versions. Ignored if `args.skipVersionUpgrade` is set to true. If null, a default is used or user will be prompted for one.
 * @param prompt {Prompt} Prompt instance to get information from the user if necessary.
 * @param directory {string} TWA project directory.
 * @param manifest {string} Path to twa-manifest.json file.
 */
async function updateProject(skipVersionUpgrade, appVersionName, prompt = new Prompt_1.InquirerPrompt(), directory, manifest) {
    var _a;
    const targetDirectory = directory || process.cwd();
    const manifestFile = manifest || path.join(process.cwd(), 'twa-manifest.json');
    const twaManifest = await core_2.TwaManifest.fromFile(manifestFile);
    twaManifest.generatorApp = constants_1.APP_NAME;
    const features = twaManifest.features;
    // Check that if Play Billing is enabled, enableNotifications must also be true.
    if (((_a = features.playBilling) === null || _a === void 0 ? void 0 : _a.enabled) && !twaManifest.enableNotifications) {
        prompt.printMessage(strings_1.enUS.errorPlayBillingEnableNotifications);
        return false;
    }
    // Check that the iconUrl exists.
    if (!twaManifest.iconUrl) {
        throw new Error(strings_1.enUS.errorIconUrlMustExist(manifestFile));
    }
    // Check that the iconUrl is valid.
    if (twaManifest.iconUrl) {
        const result = await (0, inputHelpers_1.validateImageUrl)(twaManifest.iconUrl);
        if (result.isError()) {
            throw result.unwrapError();
        }
    }
    if (!skipVersionUpgrade) {
        const newVersionInfo = await updateVersions(twaManifest, appVersionName, prompt);
        twaManifest.appVersionName = newVersionInfo.appVersionName;
        twaManifest.appVersionCode = newVersionInfo.appVersionCode;
        prompt.printMessage(strings_1.enUS.messageUpgradedAppVersion(newVersionInfo.appVersionName, newVersionInfo.appVersionCode));
    }
    const twaGenerator = new core_2.TwaGenerator();
    await twaGenerator.removeTwaProject(targetDirectory);
    await generateTwaProject(prompt, twaGenerator, targetDirectory, twaManifest);
    if (!skipVersionUpgrade) {
        await twaManifest.saveToFile(manifestFile);
    }
    await generateManifestChecksumFile(manifestFile, targetDirectory);
    prompt.printMessage(strings_1.enUS.messageProjectUpdatedSuccess);
    return true;
}
