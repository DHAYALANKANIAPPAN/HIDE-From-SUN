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
exports.DEFAULT_CONFIG_FILE_PATH = void 0;
exports.loadOrCreateConfig = loadOrCreateConfig;
const path_1 = require("path");
const os_1 = require("os");
const core_1 = require("@bubblewrap/core");
const JdkInstaller_1 = require("./JdkInstaller");
const AndroidSdkToolsInstaller_1 = require("./AndroidSdkToolsInstaller");
const fs_1 = require("fs");
const strings_1 = require("./strings");
const fs_2 = require("fs");
const Prompt_1 = require("./Prompt");
const DEFAULT_CONFIG_FOLDER = (0, path_1.join)((0, os_1.homedir)(), '.bubblewrap');
const DEFAULT_CONFIG_NAME = 'config.json';
exports.DEFAULT_CONFIG_FILE_PATH = (0, path_1.join)(DEFAULT_CONFIG_FOLDER, DEFAULT_CONFIG_NAME);
const LEGACY_CONFIG_FOLDER = (0, path_1.join)((0, os_1.homedir)(), '.llama-pack');
const LEGACY_CONFIG_NAME = 'llama-pack-config.json';
const LEGACY_CONFIG_FILE_PATH = (0, path_1.join)(LEGACY_CONFIG_FOLDER, LEGACY_CONFIG_NAME);
const DEFAULT_JDK_FOLDER = (0, path_1.join)(DEFAULT_CONFIG_FOLDER, 'jdk');
const DEFAULT_SDK_FOLDER = (0, path_1.join)(DEFAULT_CONFIG_FOLDER, 'android_sdk');
async function configAndroidSdk(prompt = new Prompt_1.InquirerPrompt()) {
    const sdkInstallRequest = await prompt.promptConfirm(strings_1.enUS.promptInstallSdk, true);
    let sdkPath;
    if (!sdkInstallRequest) {
        sdkPath = await prompt.promptInput(strings_1.enUS.promptSdkPath, null, core_1.AndroidSdkTools.validatePath);
    }
    else {
        const sdkTermsAgreement = await prompt.promptConfirm(strings_1.enUS.promptSdkTerms, false);
        if (sdkTermsAgreement) {
            await fs_2.promises.mkdir(DEFAULT_SDK_FOLDER, { recursive: true });
            prompt.printMessage(strings_1.enUS.messageDownloadSdk + DEFAULT_SDK_FOLDER);
            const androidSdkToolsInstaller = new AndroidSdkToolsInstaller_1.AndroidSdkToolsInstaller(process, prompt);
            await androidSdkToolsInstaller.install(DEFAULT_SDK_FOLDER);
            sdkPath = DEFAULT_SDK_FOLDER;
        }
        else {
            throw new Error(strings_1.enUS.errorSdkTerms);
        }
    }
    return sdkPath;
}
async function configureJdk(prompt = new Prompt_1.InquirerPrompt()) {
    const jdkInstallRequest = await prompt.promptConfirm(strings_1.enUS.promptInstallJdk, true);
    let jdkPath;
    if (!jdkInstallRequest) {
        jdkPath = await prompt.promptInput(strings_1.enUS.promptJdkPath, null, core_1.JdkHelper.validatePath);
    }
    else {
        await fs_2.promises.mkdir(DEFAULT_JDK_FOLDER, { recursive: true });
        prompt.printMessage(strings_1.enUS.messageDownloadJdk + DEFAULT_JDK_FOLDER);
        const jdkInstaller = new JdkInstaller_1.JdkInstaller(process, prompt);
        jdkPath = await jdkInstaller.install(DEFAULT_JDK_FOLDER);
    }
    return jdkPath;
}
async function renameConfigIfNeeded(log) {
    if ((0, fs_1.existsSync)(exports.DEFAULT_CONFIG_FILE_PATH))
        return;
    // No new named config file found.
    if (!(0, fs_1.existsSync)(LEGACY_CONFIG_FILE_PATH))
        return;
    // Old named config file found - rename it and its folder.
    log.info('An old named config file was found, changing it now');
    const files = await fs_2.promises.readdir(LEGACY_CONFIG_FOLDER);
    const numOfFiles = files.length;
    if (numOfFiles != 1) {
        // At this point, we know that's at least one file in the folder, `LEGACY_CONFIG_NAME, so
        // `numOfFiles' will be at least `1`. We avoid destroying / moving other files in this folder.
        await fs_2.promises.mkdir(DEFAULT_CONFIG_FOLDER);
        await fs_2.promises.rename(LEGACY_CONFIG_FILE_PATH, exports.DEFAULT_CONFIG_FILE_PATH);
    }
    else {
        await fs_2.promises.rename(LEGACY_CONFIG_FOLDER, DEFAULT_CONFIG_FOLDER);
        await fs_2.promises
            .rename((0, path_1.join)(DEFAULT_CONFIG_FOLDER, LEGACY_CONFIG_NAME), exports.DEFAULT_CONFIG_FILE_PATH);
    }
}
async function loadOrCreateConfig(log = new core_1.ConsoleLog('config'), prompt = new Prompt_1.InquirerPrompt(), path) {
    let configPath;
    if (path === undefined) {
        await renameConfigIfNeeded(log);
        configPath = exports.DEFAULT_CONFIG_FILE_PATH;
    }
    else {
        configPath = path;
    }
    let config = await core_1.Config.loadConfig(configPath);
    if (!config) {
        config = new core_1.Config('', '');
        config.saveConfig(configPath);
    }
    if (!config.jdkPath) {
        const jdkPath = await configureJdk(prompt);
        config.jdkPath = jdkPath;
        await config.saveConfig(configPath);
    }
    if (!config.androidSdkPath) {
        const androidSdkPath = await configAndroidSdk(prompt);
        config.androidSdkPath = androidSdkPath;
        await config.saveConfig(configPath);
    }
    return config;
}
