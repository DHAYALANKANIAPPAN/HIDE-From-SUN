"use strict";
/*
 * Copyright 2021 Google Inc. All Rights Reserved.
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
exports.play = play;
const core_1 = require("@bubblewrap/core");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const constants_1 = require("../constants");
const Prompt_1 = require("../Prompt");
const shared_1 = require("./shared");
const strings_1 = require("../strings");
// Default file path
const defaultSignedAppBundleFileName = 'app-release-bundle.aab';
/**
  * The Play class is the class that is used to communicate with the Google Play Store.
  */
class Play {
    constructor(args, googlePlay, prompt = new Prompt_1.InquirerPrompt()) {
        this.args = args;
        this.googlePlay = googlePlay;
        this.prompt = prompt;
    }
    /**
    * @summary Can validate the largest version number vs twa-manifest.json and update
    * to give x+1 version number.
    * @return {number} The largest version number found in the play console.
    */
    async getLargestVersion(twaManifest) {
        const versionCode = await this.googlePlay.performPlayOperation(twaManifest.packageId, async (editId) => {
            return await this.googlePlay.getLargestVersionCode(twaManifest.packageId, editId);
        });
        return versionCode;
    }
    /**
    * Publishes the Android App Bundle to the user specified {@link PlayStoreTrack} from the
    * {@link PlayArgs}.
    * @return {boolean} Whether the publish command completes successfully or not.
    */
    async publish(twaManifest) {
        var _a;
        // Validate that the publish value is listed in the available Tracks.
        // If no value was supplied with publish we make it internal.
        const userSelectedTrack = (0, core_1.asPlayStoreTrack)(((_a = this.args.track) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || 'internal');
        if (userSelectedTrack == null) {
            this.prompt.printMessage(strings_1.enUS.messageInvalidTrack);
            return false;
        }
        const defaultPath = path.join(process.cwd(), defaultSignedAppBundleFileName);
        const publishFilePath = this.args.appBundleLocation || defaultPath;
        if (!fs.existsSync(publishFilePath)) {
            throw new Error(`App Bundle not found on disk: ${publishFilePath}`);
        }
        const retainedBundles = twaManifest.retainedBundles;
        await this.googlePlay.performPlayOperation(twaManifest.packageId, async (editId) => {
            return await this.googlePlay.publishBundle(userSelectedTrack, publishFilePath, twaManifest.packageId, retainedBundles, editId);
        }, true);
        return true;
    }
    /**
    * Updates the gradle file based on the updates to the twa-manifest.json file and warns the user
    *   that they need to call build again.
    * @param {string} manifestFile - The path to the the TwaManifest JSON file.
    * @param {string} appVersionName - Optional: Changes the string representation of the version.
    */
    async updateProjectAndWarn(manifestFile, appVersionName) {
        await (0, shared_1.updateProject)(true, appVersionName || null, this.prompt, this.args.targetDirectory || process.cwd(), manifestFile);
        this.prompt.printMessage(strings_1.enUS.messageCallBubblewrapBuild);
    }
    /**
    * Runs the playRetain command. This handles the retaining of packages that are published on Play.
    * @return {boolean} Returns whether or not the run command completed successfully.
    */
    async runRetain(prompt) {
        // TODO Remove when it's not experimental anymore
        if (!await prompt.promptConfirm(strings_1.enUS.promptExperimentalFeature, false)) {
            return true;
        }
        const manifestFile = this.args.manifest || path.join(process.cwd(), constants_1.TWA_MANIFEST_FILE_NAME);
        const twaManifest = await core_1.TwaManifest.fromFile(manifestFile);
        // bubblewrap playRetain --add 86
        if (this.args.add) {
            const versionToRetain = this.args.add;
            // Validate an integer was supplied.
            if (!Number.isInteger(versionToRetain)) {
                throw new Error(strings_1.enUS.versionRetainedNotAnInteger);
            }
            if (versionToRetain > twaManifest.appVersionCode) {
                // Cannot retain a higher version as that would take precedence.
                await this.prompt.printMessage(strings_1.enUS.versionToRetainHigherThanBuildVersion(twaManifest.appVersionCode, versionToRetain));
            }
            // Validate that the version exists on the Play Servers.
            const exists = await this.googlePlay.performPlayOperation(twaManifest.packageId, async (editId) => {
                return await this.googlePlay.versionExists(twaManifest.packageId, versionToRetain, editId);
            });
            if (!exists) {
                throw new Error(strings_1.enUS.versionDoesNotExistOnServer);
            }
            const alreadyRetained = twaManifest.retainedBundles.find((version) => version == versionToRetain);
            if (!alreadyRetained) {
                twaManifest.retainedBundles.push(versionToRetain);
            }
            await twaManifest.saveToFile(manifestFile);
        }
        // bubblewrap playRetain --remove 86
        if (this.args.remove) {
            const versionToRemove = this.args.remove;
            twaManifest.retainedBundles = twaManifest.retainedBundles.filter((obj) => {
                return obj != versionToRemove;
            });
            await twaManifest.saveToFile(manifestFile);
        }
        // bubblewrap playRetain --list
        if (this.args.list) {
            twaManifest.retainedBundles.forEach((version) => {
                this.prompt.printMessage(`${version}`);
            });
        }
        return true;
    }
    /**
     * Calls the publish workflow to the Play Store. This takes a user supplied track (or internal)
     *  and an appBundleLocation (defaults to the current directory) and uploads these artifacts to
     *  the Google Play Store.
     * @returns whether the playPublish command completed successfully
     */
    async runPlayPublish() {
        const manifestFile = this.args.manifest || path.join(process.cwd(), constants_1.TWA_MANIFEST_FILE_NAME);
        const twaManifest = await core_1.TwaManifest.fromFile(manifestFile);
        const success = await this.publish(twaManifest);
        if (!success) {
            this.prompt.printMessage(strings_1.enUS.messagePublishingWasNotSuccessful);
            return false;
        }
        this.prompt.printMessage(strings_1.enUS.messagePlayUploadSuccess);
        return true;
    }
    /**
     * Runs the version check workflow. If the published version is higher than that of the twaManifest,
     *  we assume that the version that exists locally is needs to be updated to a higher version.
     */
    async runVersionCheck() {
        const manifestFile = this.args.manifest || path.join(process.cwd(), constants_1.TWA_MANIFEST_FILE_NAME);
        const twaManifest = await core_1.TwaManifest.fromFile(manifestFile);
        // bubblewrap playVersionCheck
        const version = await this.getLargestVersion(twaManifest);
        if (version >= twaManifest.appVersionCode) {
            const updateVersion = await this.prompt.promptConfirm(strings_1.enUS.promptVersionMismatch(twaManifest.appVersionCode.toString(), version.toString()), true);
            if (updateVersion) {
                if (twaManifest.appVersionCode.toString() == twaManifest.appVersionName) {
                    twaManifest.appVersionName = (version + 1).toString();
                }
                twaManifest.appVersionCode = version + 1;
                await twaManifest.saveToFile(manifestFile);
                await this.updateProjectAndWarn(manifestFile);
            }
        }
    }
}
/**
  * Validates that the service account JSON file exists.
  * @param {string | undefined} path - The path the the JSON file.
  * @return {boolean} Whether or not the JSON file exists.
  */
function validServiceAccountJsonFile(path) {
    if (path == undefined) {
        return false;
    }
    if (!fs.existsSync(path)) {
        return false;
    }
    return true;
}
async function setupGooglePlay(args) {
    const manifestFile = args.manifest || path.join(process.cwd(), constants_1.TWA_MANIFEST_FILE_NAME);
    const twaManifest = await core_1.TwaManifest.fromFile(manifestFile);
    // Update the TWA-Manifest if service account is supplied
    // bubblewrap play --serviceAccountFile="/path/to/service-account.json"
    // --manifest="/path/twa-manifest.json"
    if (args.serviceAccountFile) {
        twaManifest.serviceAccountJsonFile = args.serviceAccountFile;
        await twaManifest.saveToFile(manifestFile);
    }
    if (!twaManifest.serviceAccountJsonFile ||
        !validServiceAccountJsonFile(twaManifest.serviceAccountJsonFile)) {
        throw new Error(strings_1.enUS.messageServiceAccountJSONMissing);
    }
    // Setup Google Play since we can confirm that the serviceAccountJsonFile is valid.
    return new core_1.GooglePlay(twaManifest.serviceAccountJsonFile);
}
async function play(args, prompt = new Prompt_1.InquirerPrompt()) {
    if (args._.length < 2) {
        throw new Error(strings_1.enUS.errorMissingArgument(2, args._.length));
    }
    const googlePlay = await setupGooglePlay(args);
    const play = new Play(args, googlePlay, prompt);
    const subcommand = args._[1];
    switch (subcommand) {
        case 'publish':
            return play.runPlayPublish();
        case 'versionCheck':
            await play.runVersionCheck();
            return true;
        case 'retain':
            return play.runRetain(prompt);
        default:
            throw new Error(`Unknown subcommand: ${subcommand}`);
    }
}
