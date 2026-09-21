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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateColor = validateColor;
exports.validateUrl = validateUrl;
exports.validateImageUrl = validateImageUrl;
exports.validateOptionalImageUrl = validateOptionalImageUrl;
exports.validateOptionalUrl = validateOptionalUrl;
exports.createValidateString = createValidateString;
exports.validateHost = validateHost;
exports.validateDisplayMode = validateDisplayMode;
exports.validateOrientation = validateOrientation;
exports.validateInteger = validateInteger;
exports.validatePackageId = validatePackageId;
exports.validateSha256Fingerprint = validateSha256Fingerprint;
const color_1 = __importDefault(require("color"));
const url_1 = require("url");
const valid_url_1 = require("valid-url");
const core_1 = require("@bubblewrap/core");
const strings_1 = require("./strings");
const url_2 = require("url");
const mime_types_1 = require("mime-types");
/**
 * A {@link ValidateFunction} that receives a {@link string} as input and resolves to a
 * {@link Color} when successful.
 * @param {string} color a string to be converted to a {@link Color}.
 * @returns {Result<Color, Error>} a results that resolves to a {@link Color} on success or
 * {@link Error} on failure.
 */
async function validateColor(color) {
    try {
        return core_1.Result.ok(new color_1.default(color));
    }
    catch (_) {
        return core_1.Result.error(new Error(strings_1.enUS.errorInvalidColor(color)));
    }
}
;
/**
 * A {@link ValidateFunction} that receives a {@link string} as input and resolves to a
 * {@link URL} when successful. If the string is empty, the validation fails and the
 * {@link Result} returned by the function is an {@link Error}.
 * @param {string} url a string to be converted to a {@link URL}.
 * @returns {Result<URL, Error>} a results that resolves to a {@link URL} on success or
 * {@link Error} on failure.
 */
async function validateUrl(url) {
    if ((0, valid_url_1.isWebUri)(url) === undefined) {
        return core_1.Result.error(new Error(strings_1.enUS.errorInvalidUrl(url)));
    }
    try {
        return core_1.Result.ok(new url_1.URL(url));
    }
    catch (e) {
        return core_1.Result.error(new Error(strings_1.enUS.errorInvalidUrl(url)));
    }
}
/**
 * A {@link ValidateFunction} that receives a {@link string} as input and resolves to a
 * {@link URL} when successful. If the URL points to a type that doesn't resolve to a
 * `image/*` mime-type, if it resolves to `image/svg*`, or if the string is empty, the
 * validation fails and the {@link Result} returned by the function is an {@link Error}.
 * @param {string} url a string to be converted to a {@link URL}.
 * @returns {Result<URL, Error>} a results that resolves to a {@link URL} on success or
 * {@link Error} on failure.
 */
async function validateImageUrl(url) {
    const mimeType = (0, mime_types_1.lookup)(url);
    // Don't validate mime-type if we are unable to find what it is.
    if (mimeType) {
        if (!mimeType.startsWith('image/')) {
            return core_1.Result.error(new Error(strings_1.enUS.errorUrlMustBeImage(mimeType)));
        }
    }
    return validateUrl(url);
}
/**
 * A {@link ValidateFunction} that receives a {@link string} as input and resolves to a
 * {@link URL} or {@link null} when successful.
 * If the string is empty, the validation succeeds and the {@link Result} returned by the
 * function resolves to {@link null}.
 * If the URL points to a type that doesn't resolve to a `image/*` mime-type or if it resolves
 * to `image/svg*` the validation fails and the {@link Result} returned by the function is an
 * {@link Error}.
 * @param {string} url a string to be converted to a {@link URL}.
 * @returns {Result<URL, Error>} a results that resolves to a {@link URL} on success or
 * {@link Error} on failure.
 */
async function validateOptionalImageUrl(input) {
    const url = input.trim();
    if (url.length === 0) {
        return core_1.Result.ok(null);
    }
    return validateImageUrl(url);
}
/**
 * A {@link ValidateFunction} that receives a {@link string} as input and resolves to a
 * {@link URL} or {@link null} when successful. If the string is empty, the validation succeeds
 * and the {@link Result} returned by the function {@link null}. Non-empty strings are validated
 * and a conversion is attempted.
 * @param {string} url a string to be converted to a {@link URL}.
 * @returns {Result<URL, Error>} a results that resolves to a {@link URL} on success or
 * {@link Error} on failure.
 */
async function validateOptionalUrl(input) {
    const url = input.trim();
    if (url.length === 0) {
        return core_1.Result.ok(null);
    }
    return validateUrl(url);
}
/**
 * Creates a {@link ValidateFunction<string>} that checks the input {@link string} against the
 * constraints provided as parameters.
 * @param {number?} minLength optional *minimum* length.
 * @param {number?} maxLength optional *maximum* length.
 */
function createValidateString(minLength, maxLength) {
    return async (input) => {
        input = input.trim();
        if (minLength && input.length < minLength) {
            return core_1.Result.error(new Error(strings_1.enUS.errorMinLength(minLength, input.length)));
        }
        if (maxLength && input.length > maxLength) {
            return core_1.Result.error(new Error(strings_1.enUS.errorMaxLength(maxLength, input.length)));
        }
        return core_1.Result.ok(input);
    };
}
;
/**
 * A {@link ValidateFunction} that receives a {@link string} as input and resolves to a
 * {@link string} when successful. This function verifies if the input is an acceptable
 * hostname. If a full URL is passed, it must start with `https://`. The hostname will be
 * extracted from the full URL and returned, if the validation is successful.
 * @param {string} input a string to be validated.
 * @returns {Result<string, Error>} a results that resolves to a {@link string} on success or
 * {@link Error} on failure.
 */
async function validateHost(input) {
    let host = input.trim();
    if (host.length <= 0) {
        return core_1.Result.error(new Error(strings_1.enUS.errorMinLength(1, input.length)));
    }
    // Check if user added the scheme to the input.
    const parts = host.split('://');
    if (parts.length > 2) {
        return core_1.Result.error(new Error(strings_1.enUS.errorInvalidUrl(input)));
    }
    // If a scheme was added, it must be HTTPS. We don't really care about this in the code, as we
    // only use the host part of the URI, but this might lead users to believe the final
    // application will open a different scheme from what they originally intended.
    if (parts.length === 2) {
        if (parts[0] !== 'https') {
            return core_1.Result.error(new Error(strings_1.enUS.errorRequireHttps));
        }
        host = parts[1];
    }
    // Verify if the characters added to the domain are valid. This functions returns an empty
    // string when the input is invalid.
    const ascIIInput = (0, url_2.domainToASCII)(host);
    if (ascIIInput.length === 0) {
        return core_1.Result.error(new Error(strings_1.enUS.errorInvalidUrl(input)));
    }
    // Finally, try building an URL object. If it fails, we likely have an invalid host.
    try {
        new url_1.URL('https://' + host);
    }
    catch (e) {
        return core_1.Result.error(new Error(strings_1.enUS.errorInvalidUrl(input)));
    }
    return core_1.Result.ok(host);
}
;
/**
 * A {@link ValidateFunction} that receives a {@link string} as input and resolves to a
 * {@link DisplayMode} when successful.
 * @param {string} input a string to be converted to a {@link DisplayMode}.
 * @returns {Result<DisplayMode, Error>} a result that resolves to a {@link DisplayMode} on
 * success or {@link Error} on failure.
 */
async function validateDisplayMode(input) {
    const displayMode = (0, core_1.asDisplayMode)(input);
    if (displayMode === null) {
        return core_1.Result.error(new Error(strings_1.enUS.errorInvalidDisplayMode(input)));
    }
    return core_1.Result.ok(displayMode);
}
/**
 * A {@link ValidateFunction} that receives a {@link string} as input and resolves to a
 * {@link Orientation} when successful.
 * @param {string} input a string to be converted to a {@link Orientation}.
 * @returns {Result<Orientation, Error>} a result that resolves to a {@link Orientation} on
 * success or {@link Error} on failure.
 */
async function validateOrientation(input) {
    const orientation = (0, core_1.asOrientation)(input);
    if (orientation === null) {
        return core_1.Result.error(new Error(strings_1.enUS.errorInvalidOrientation(input)));
    }
    return core_1.Result.ok(orientation);
}
/**
 * A {@link ValidateFunction} that receives a {@link string} as input and resolves to a
 * {@link number} when successful.
 * @param {string} input a string to be converted to a {@link number} integer.
 * @returns {Result<number, Error>} a result that resolves to a {@link number} integer on
 * success or {@link Error} on error.
 */
async function validateInteger(input) {
    const validNumber = Number.parseFloat(input);
    if (!Number.isInteger(validNumber)) {
        return core_1.Result.error(new Error(strings_1.enUS.errorInvalidInteger(input)));
    }
    return core_1.Result.ok(validNumber);
}
/**
 * A {@link ValidateFunction} that receives a {@link string} as input and resolves to a
 * {@link DisplayMode} when successful. Verifies if the input is a valid Android packageId. See
 * {@link util.validatePackageId} for more details on the packageId validation.
 * @param {string} input a string to be validated as a packageId.
 * @returns {Result<string, Error>} a result that resolves to a {@link string} on
 * success or {@link Error} on failure.
 */
async function validatePackageId(input) {
    const result = core_1.util.validatePackageId(input);
    if (result !== null) {
        return core_1.Result.error(new Error(result));
    }
    return core_1.Result.ok(input);
}
/**
 * A {@link ValidateFunction} that receives a {@link string} as input and resolves to a
 * {@link string} when successful. Verifies if the input is a valid SHA-256 fingerprint.
 * @param {string} input a string representing a SHA-256 fingerprint.
 * @returns {Result<string, Error>} a result that resolves to a {@link string} on
 * success or {@link Error} on failure.
 */
async function validateSha256Fingerprint(input) {
    input = input.toUpperCase();
    if (input.match(/^([0-9A-F]{2}:){31}[0-9A-F]{2}$/)) {
        return core_1.Result.ok(input);
    }
    return core_1.Result.error(new Error(strings_1.enUS.errorInvalidSha256Fingerprint(input)));
}
