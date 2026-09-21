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
exports.init = init;
const fs = __importStar(require("fs"));
const path_1 = require("path");
const core_1 = require("@bubblewrap/core");
const inputHelpers_1 = require("../inputHelpers");
const constants_1 = require("../constants");
const Prompt_1 = require("../Prompt");
const strings_1 = require("../strings");
const shared_1 = require("./shared");
async function confirmTwaConfig(twaManifest, prompt) {
    // Warn about the Google Play Family Policy
    prompt.printMessage(strings_1.enUS.warnFamilyPolicy);
    // Step 1/5 - Collect information on the Web App.
    prompt.printMessage(strings_1.enUS.messageWebAppDetails);
    prompt.printMessage(strings_1.enUS.messageWebAppDetailsDesc);
    twaManifest.host = await prompt.promptInput(strings_1.enUS.promptHostMessage, twaManifest.host, inputHelpers_1.validateHost);
    twaManifest.startUrl = await prompt.promptInput(strings_1.enUS.promptStartUrl, twaManifest.startUrl, (0, inputHelpers_1.createValidateString)(1));
    // Step 2/5 Collect information on the Android App.
    prompt.printMessage(strings_1.enUS.messageAndroidAppDetails);
    prompt.printMessage(strings_1.enUS.messageAndroidAppDetailsDesc);
    twaManifest.name = await prompt.promptInput(strings_1.enUS.promptName, twaManifest.name, (0, inputHelpers_1.createValidateString)(1, 50));
    twaManifest.launcherName = await prompt.promptInput(strings_1.enUS.promptLauncherName, twaManifest.launcherName, (0, inputHelpers_1.createValidateString)(1, 12));
    twaManifest.packageId = await prompt.promptInput(strings_1.enUS.promptPackageId, twaManifest.packageId, inputHelpers_1.validatePackageId);
    twaManifest.appVersionCode = await prompt.promptInput(strings_1.enUS.promptVersionCode, twaManifest.appVersionCode.toString(), inputHelpers_1.validateInteger);
    twaManifest.appVersionName = twaManifest.appVersionCode.toString();
    twaManifest.display = await prompt.promptChoice(strings_1.enUS.promptDisplayMode, core_1.DisplayModes, twaManifest.display, inputHelpers_1.validateDisplayMode);
    twaManifest.orientation = await prompt.promptChoice(strings_1.enUS.promptOrientation, core_1.Orientations, twaManifest.orientation, inputHelpers_1.validateOrientation);
    twaManifest.themeColor = await prompt.promptInput(strings_1.enUS.promptThemeColor, twaManifest.themeColor.hex(), inputHelpers_1.validateColor);
    // Step 3/5 Launcher Icons and Splash Screen.
    prompt.printMessage(strings_1.enUS.messageLauncherIconAndSplash);
    prompt.printMessage(strings_1.enUS.messageLauncherIconAndSplashDesc);
    twaManifest.backgroundColor = await prompt.promptInput(strings_1.enUS.promptBackgroundColor, twaManifest.backgroundColor.hex(), inputHelpers_1.validateColor);
    twaManifest.iconUrl = (await prompt.promptInput(strings_1.enUS.promptIconUrl, twaManifest.iconUrl ? twaManifest.iconUrl : '', inputHelpers_1.validateImageUrl)).toString();
    const maskableIconUrl = await prompt.promptInput(strings_1.enUS.promptMaskableIconUrl, twaManifest.maskableIconUrl ? twaManifest.maskableIconUrl : '', inputHelpers_1.validateOptionalImageUrl);
    twaManifest.maskableIconUrl = maskableIconUrl ? maskableIconUrl.toString() : undefined;
    // Step 4/5 Optional Features.
    prompt.printMessage(strings_1.enUS.messageOptionFeatures);
    prompt.printMessage(strings_1.enUS.messageOptionalFeaturesDesc);
    if (twaManifest.shortcuts.length > 0) {
        const addShortcuts = await prompt.promptConfirm(strings_1.enUS.promptShortcuts, true);
        if (!addShortcuts) {
            twaManifest.shortcuts = [];
        }
    }
    const monochromeIconUrl = await prompt.promptInput(strings_1.enUS.promptMonochromeIconUrl, twaManifest.monochromeIconUrl ? twaManifest.monochromeIconUrl : '', inputHelpers_1.validateOptionalImageUrl);
    twaManifest.monochromeIconUrl = monochromeIconUrl ? monochromeIconUrl.toString() : undefined;
    const playBillingEnabled = await prompt.promptConfirm(strings_1.enUS.promptPlayBilling, false);
    if (playBillingEnabled) {
        twaManifest.features = {
            ...twaManifest.features,
            playBilling: {
                enabled: true,
            },
        };
    }
    const locationDelegationEnabled = await prompt.promptConfirm(strings_1.enUS.promptLocationDelegation, false);
    if (locationDelegationEnabled) {
        twaManifest.features = {
            ...twaManifest.features,
            locationDelegation: {
                enabled: true,
            },
        };
    }
    // Step 5/5 Signing Key Information.
    prompt.printMessage(strings_1.enUS.messageSigningKeyInformation);
    prompt.printMessage(strings_1.enUS.messageSigningKeyInformationDesc);
    twaManifest.signingKey.path = await prompt.promptInput(strings_1.enUS.promptKeyPath, twaManifest.signingKey.path, (0, inputHelpers_1.createValidateString)(6));
    twaManifest.signingKey.alias = await prompt.promptInput(strings_1.enUS.promptKeyAlias, twaManifest.signingKey.alias, (0, inputHelpers_1.createValidateString)(1));
    twaManifest.generatorApp = constants_1.APP_NAME;
    return twaManifest;
}
async function createSigningKey(twaManifest, config, prompt) {
    // Signing Key already exists. Skip creation.
    if (fs.existsSync(twaManifest.signingKey.path)) {
        return;
    }
    const jdkHelper = new core_1.JdkHelper(process, config);
    const keytool = new core_1.KeyTool(jdkHelper);
    prompt.printMessage(strings_1.enUS.messageSigningKeyCreation);
    prompt.printMessage(strings_1.enUS.messageSigningKeyNotFound(twaManifest.signingKey.path));
    // Ask user if they want to create a signing key now.
    if (!await prompt.promptConfirm(strings_1.enUS.promptCreateKey, true)) {
        return;
    }
    const fullName = await prompt.promptInput(strings_1.enUS.promptKeyFullName, null, (0, inputHelpers_1.createValidateString)(1));
    const organizationalUnit = await prompt.promptInput(strings_1.enUS.promptKeyOrganizationalUnit, null, (0, inputHelpers_1.createValidateString)(1));
    const organization = await prompt.promptInput(strings_1.enUS.promptKeyOrganization, null, (0, inputHelpers_1.createValidateString)(1));
    const country = await prompt.promptInput(strings_1.enUS.promptKeyCountry, null, (0, inputHelpers_1.createValidateString)(2, 2));
    const keystorePassword = await prompt.promptPassword(strings_1.enUS.promptKeystorePassword, (0, inputHelpers_1.createValidateString)(6));
    const keyPassword = await prompt.promptPassword(strings_1.enUS.promptKeyPassword, (0, inputHelpers_1.createValidateString)(6));
    await keytool.createSigningKey({
        fullName: fullName,
        organizationalUnit: organizationalUnit,
        organization: organization,
        country: country,
        password: keystorePassword,
        keypassword: keyPassword,
        alias: twaManifest.signingKey.alias,
        path: twaManifest.signingKey.path,
    });
}
async function init(args, config, prompt = new Prompt_1.InquirerPrompt()) {
    if (!args.manifest) {
        prompt.printMessage(strings_1.enUS.errorMissingManifestParameter);
        return false;
    }
    prompt.printMessage(strings_1.enUS.messageInitializingWebManifest(args.manifest));
    // Ensure `targetDirectory` exists.
    const targetDirectory = (0, path_1.resolve)(process.cwd(), args.directory || './');
    if (!fs.existsSync(targetDirectory)) {
        // Confirm if the directory should be created. Otherwise, thrown an error.
        if (!await prompt.promptConfirm(strings_1.enUS.promptCreateDirectory(targetDirectory), true)) {
            throw new Error(strings_1.enUS.errorDirectoryDoesNotExist(targetDirectory));
        }
        fs.promises.mkdir(targetDirectory, { recursive: true });
    }
    let twaManifest = await core_1.TwaManifest.fromWebManifest(args.manifest);
    if (args.chromeosonly) {
        twaManifest.isChromeOSOnly = true;
    }
    if (args.metaquest) {
        twaManifest.isMetaQuest = true;
        twaManifest.minSdkVersion = 23;
        // Warn about increasing the minimum Android API Level
        prompt.printMessage(strings_1.enUS.warnIncreasingMinSdkVersion);
    }
    if (args.alphaDependencies) {
        twaManifest.alphaDependencies = {
            enabled: true,
        };
    }
    // The default path is "./android-keystore". Make sure it's relative to "targetDirectory".
    twaManifest.signingKey.path = (0, path_1.join)(targetDirectory, twaManifest.signingKey.path);
    twaManifest = await confirmTwaConfig(twaManifest, prompt);
    const twaGenerator = new core_1.TwaGenerator();
    await twaManifest.saveToFile((0, path_1.join)(targetDirectory, '/twa-manifest.json'));
    await (0, shared_1.generateTwaProject)(prompt, twaGenerator, targetDirectory, twaManifest);
    await (0, shared_1.generateManifestChecksumFile)((0, path_1.join)(targetDirectory, '/twa-manifest.json'), targetDirectory);
    await createSigningKey(twaManifest, config, prompt);
    prompt.printMessage(strings_1.enUS.messageProjectGeneratedSuccess);
    return true;
}
