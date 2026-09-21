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
exports.TWA_MANIFEST_FILE_NAME = exports.BUBBLEWRAP_LOGO = exports.ASSETLINKS_OUTPUT_FILE = exports.APP_NAME = void 0;
const colors_1 = require("colors");
exports.APP_NAME = 'bubblewrap-cli';
exports.ASSETLINKS_OUTPUT_FILE = './assetlinks.json';
exports.BUBBLEWRAP_LOGO = (0, colors_1.magenta)(
/* eslint-disable indent */
`,-----.        ,--.  ,--.  ,--.
|  |) /_,--.,--|  |-.|  |-.|  |,---.,--.   ,--,--.--.,--,--.,---.
|  .-.  |  ||  | .-. | .-. |  | .-. |  |.'.|  |  .--' ,-.  | .-. |
|  '--' '  ''  | \`-' | \`-' |  \\   --|   .'.   |  |  \\ '-'  | '-' '
\`------' \`----' \`---' \`---'\`--'\`----'--'   '--\`--'   \`--\`--|  |-'
                                                           \`--\'    `);
/* eslint-enable indent */
exports.TWA_MANIFEST_FILE_NAME = './twa-manifest.json';
