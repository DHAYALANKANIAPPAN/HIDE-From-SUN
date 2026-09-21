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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InquirerPrompt = void 0;
const core_1 = require("@bubblewrap/core");
const cli_progress_1 = require("cli-progress");
const colors_1 = require("colors");
const inquirer_1 = __importDefault(require("inquirer"));
const KILOBYTE_SIZE = 1024;
// Builds an Inquirer validate function from a `ValidateFunction<T>`. From the inquirer docs:
//
// validate: (Function) Receive the user input and answers hash. Should return true if the
//           value is valid, and an error message (String) otherwise. If false is returned,
//           a default error message is provided.
function buildInquirerValidate(validateFunction) {
    return async (input) => {
        const result = await validateFunction(input);
        if (result.isOk()) {
            return true;
        }
        return result.unwrapError().message;
    };
}
/**
 * A {@link Prompt} implementation powered by inquirer.js (https://www.npmjs.com/package/inquirer)
 */
class InquirerPrompt {
    async printMessage(message) {
        console.log(message);
    }
    async promptInput(message, defaultValue, validateFunction) {
        const validate = buildInquirerValidate(validateFunction);
        const result = await inquirer_1.default.prompt({
            name: 'question',
            type: 'input',
            message: message,
            default: defaultValue,
            validate: validate,
        });
        return (await validateFunction(result.question)).unwrap();
    }
    async promptChoice(message, choices, defaultValue, validateFunction) {
        const validate = buildInquirerValidate(validateFunction);
        const result = await inquirer_1.default.prompt({
            name: 'question',
            type: 'list',
            message: message,
            default: defaultValue,
            choices: choices,
            validate: validate,
        });
        return (await validateFunction(result.question)).unwrap();
    }
    async promptConfirm(message, defaultValue) {
        const result = await inquirer_1.default.prompt({
            name: 'question',
            type: 'confirm',
            message: message,
            default: defaultValue,
        });
        return result.question;
    }
    async promptPassword(message, validateFunction) {
        const validate = buildInquirerValidate(validateFunction);
        const result = await inquirer_1.default.prompt({
            name: 'question',
            type: 'password',
            message: message,
            validate: validate,
            mask: '*',
        });
        return (await validateFunction(result.question)).unwrap();
    }
    async downloadFile(url, filename, totalSize = 0) {
        const progressBar = new cli_progress_1.Bar({
            format: ` >> [${(0, colors_1.green)('{bar}')}] {percentage}% | {value}k of {total}k`,
        }, cli_progress_1.Presets.shades_classic);
        progressBar.start(Math.round(totalSize / KILOBYTE_SIZE), 0);
        await core_1.fetchUtils.downloadFile(url, filename, (current, total) => {
            if (total > 0 && total !== totalSize) {
                progressBar.setTotal(Math.round(total / KILOBYTE_SIZE));
                totalSize = total;
            }
            progressBar.update(Math.round(current / KILOBYTE_SIZE));
        });
        progressBar.stop();
    }
}
exports.InquirerPrompt = InquirerPrompt;
