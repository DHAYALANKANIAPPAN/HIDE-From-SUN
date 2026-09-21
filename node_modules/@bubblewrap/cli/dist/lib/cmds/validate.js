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
exports.validate = validate;
const validator_1 = require("@bubblewrap/validator");
const core_1 = require("@bubblewrap/core");
const pwaValidationHelper_1 = require("../pwaValidationHelper");
const log = new core_1.ConsoleLog('validate');
/**
 * Runs the PwaValidator to check a given URL agains the Quality criteria. More information on the
 * Quality Criteria available at: https://web.dev/using-a-pwa-in-your-android-app/#quality-criteria
 * @param {ParsedArgs} args
 */
async function validate(args) {
    log.info('Validating URL: ', args.url);
    const validationResult = await validator_1.PwaValidator.validate(new URL(args.url));
    (0, pwaValidationHelper_1.printValidationResult)(validationResult, log);
    return validationResult.status === 'PASS';
}
