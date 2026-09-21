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
exports.AndroidSdkToolsInstaller = void 0;
const path = __importStar(require("path"));
const core_1 = require("@bubblewrap/core");
const strings_1 = require("./strings");
const SDK_VERSION = '6609375';
const DOWNLOAD_SDK_ROOT = 'https://dl.google.com/android/repository/';
const WINDOWS_URL = `commandlinetools-win-${SDK_VERSION}_latest.zip`;
const MAC_URL = `commandlinetools-mac-${SDK_VERSION}_latest.zip`;
const LINUX_URL = `commandlinetools-linux-${SDK_VERSION}_latest.zip`;
/**
 * Install Android Command Line Tools by downloading the zip and
 * decompressing it.
 */
class AndroidSdkToolsInstaller {
    constructor(process, prompt) {
        this.process = process;
        this.prompt = prompt;
    }
    /**
     * Downloads the platform-appropriate version of Android
     * Command Line Tools.
     *
     * @param installPath {string} path to install SDK at.
     */
    async install(installPath) {
        let downloadFileName;
        switch (this.process.platform) {
            case 'darwin': {
                downloadFileName = MAC_URL;
                break;
            }
            case 'linux': {
                downloadFileName = LINUX_URL;
                break;
            }
            case 'win32': {
                downloadFileName = WINDOWS_URL;
                break;
            }
            default: throw new Error(`Unsupported Platform: ${this.process.platform}`);
        }
        const dstPath = path.resolve(installPath);
        const downloadUrl = DOWNLOAD_SDK_ROOT + downloadFileName;
        const localPath = path.join(dstPath, downloadFileName);
        this.prompt.printMessage(strings_1.enUS.messageDownloadAndroidSdk);
        await this.prompt.downloadFile(downloadUrl, localPath);
        this.prompt.printMessage(strings_1.enUS.messageDecompressAndroidSdk);
        await core_1.util.unzipFile(localPath, dstPath, true);
    }
}
exports.AndroidSdkToolsInstaller = AndroidSdkToolsInstaller;
