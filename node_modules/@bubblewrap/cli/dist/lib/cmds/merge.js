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
exports.merge = merge;
const path = __importStar(require("path"));
const core_1 = require("@bubblewrap/core");
const shared_1 = require("./shared");
/**
 * Updates an existing TWA Project using the `twa-manifest.json`.
 * @param {string} [args.fieldsToIgnore] the fields that shouldn't be updated.
 */
async function merge(args) {
    // If there is nothing to ignore, continue with an empty list.
    const fieldsToIgnore = args.ignore || [];
    const manifestPath = path.join(process.cwd(), 'twa-manifest.json');
    const twaManifest = await core_1.TwaManifest.fromFile(manifestPath);
    const webManifestUrl = twaManifest.webManifestUrl;
    const webManifest = await core_1.util.getWebManifest(webManifestUrl);
    const newTwaManifest = await core_1.TwaManifest.merge(fieldsToIgnore, webManifestUrl, webManifest, twaManifest);
    // Update the app (args are not relevant in this case, because update's default values
    // are valid for it. We just send something as an input).
    if (!args.skipVersionUpgrade) {
        const newVersionInfo = await (0, shared_1.updateVersions)(newTwaManifest, args.appVersionName || twaManifest.appVersionName);
        newTwaManifest.appVersionName = newVersionInfo.appVersionName;
        newTwaManifest.appVersionCode = newVersionInfo.appVersionCode;
    }
    await newTwaManifest.saveToFile(manifestPath);
    return true;
}
