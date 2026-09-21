import Color from 'color';
import { URL } from 'url';
import { Result, DisplayMode, Orientation } from '@bubblewrap/core';
import { ValidateFunction } from './Prompt';
/**
 * A {@link ValidateFunction} that receives a {@link string} as input and resolves to a
 * {@link Color} when successful.
 * @param {string} color a string to be converted to a {@link Color}.
 * @returns {Result<Color, Error>} a results that resolves to a {@link Color} on success or
 * {@link Error} on failure.
 */
export declare function validateColor(color: string): Promise<Result<Color, Error>>;
/**
 * A {@link ValidateFunction} that receives a {@link string} as input and resolves to a
 * {@link URL} when successful. If the string is empty, the validation fails and the
 * {@link Result} returned by the function is an {@link Error}.
 * @param {string} url a string to be converted to a {@link URL}.
 * @returns {Result<URL, Error>} a results that resolves to a {@link URL} on success or
 * {@link Error} on failure.
 */
export declare function validateUrl(url: string): Promise<Result<URL, Error>>;
/**
 * A {@link ValidateFunction} that receives a {@link string} as input and resolves to a
 * {@link URL} when successful. If the URL points to a type that doesn't resolve to a
 * `image/*` mime-type, if it resolves to `image/svg*`, or if the string is empty, the
 * validation fails and the {@link Result} returned by the function is an {@link Error}.
 * @param {string} url a string to be converted to a {@link URL}.
 * @returns {Result<URL, Error>} a results that resolves to a {@link URL} on success or
 * {@link Error} on failure.
 */
export declare function validateImageUrl(url: string): Promise<Result<URL, Error>>;
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
export declare function validateOptionalImageUrl(input: string): Promise<Result<URL | null, Error>>;
/**
 * A {@link ValidateFunction} that receives a {@link string} as input and resolves to a
 * {@link URL} or {@link null} when successful. If the string is empty, the validation succeeds
 * and the {@link Result} returned by the function {@link null}. Non-empty strings are validated
 * and a conversion is attempted.
 * @param {string} url a string to be converted to a {@link URL}.
 * @returns {Result<URL, Error>} a results that resolves to a {@link URL} on success or
 * {@link Error} on failure.
 */
export declare function validateOptionalUrl(input: string): Promise<Result<URL | null, Error>>;
/**
 * Creates a {@link ValidateFunction<string>} that checks the input {@link string} against the
 * constraints provided as parameters.
 * @param {number?} minLength optional *minimum* length.
 * @param {number?} maxLength optional *maximum* length.
 */
export declare function createValidateString(minLength?: number, maxLength?: number): ValidateFunction<string>;
/**
 * A {@link ValidateFunction} that receives a {@link string} as input and resolves to a
 * {@link string} when successful. This function verifies if the input is an acceptable
 * hostname. If a full URL is passed, it must start with `https://`. The hostname will be
 * extracted from the full URL and returned, if the validation is successful.
 * @param {string} input a string to be validated.
 * @returns {Result<string, Error>} a results that resolves to a {@link string} on success or
 * {@link Error} on failure.
 */
export declare function validateHost(input: string): Promise<Result<string, Error>>;
/**
 * A {@link ValidateFunction} that receives a {@link string} as input and resolves to a
 * {@link DisplayMode} when successful.
 * @param {string} input a string to be converted to a {@link DisplayMode}.
 * @returns {Result<DisplayMode, Error>} a result that resolves to a {@link DisplayMode} on
 * success or {@link Error} on failure.
 */
export declare function validateDisplayMode(input: string): Promise<Result<DisplayMode, Error>>;
/**
 * A {@link ValidateFunction} that receives a {@link string} as input and resolves to a
 * {@link Orientation} when successful.
 * @param {string} input a string to be converted to a {@link Orientation}.
 * @returns {Result<Orientation, Error>} a result that resolves to a {@link Orientation} on
 * success or {@link Error} on failure.
 */
export declare function validateOrientation(input: string): Promise<Result<Orientation, Error>>;
/**
 * A {@link ValidateFunction} that receives a {@link string} as input and resolves to a
 * {@link number} when successful.
 * @param {string} input a string to be converted to a {@link number} integer.
 * @returns {Result<number, Error>} a result that resolves to a {@link number} integer on
 * success or {@link Error} on error.
 */
export declare function validateInteger(input: string): Promise<Result<number, Error>>;
/**
 * A {@link ValidateFunction} that receives a {@link string} as input and resolves to a
 * {@link DisplayMode} when successful. Verifies if the input is a valid Android packageId. See
 * {@link util.validatePackageId} for more details on the packageId validation.
 * @param {string} input a string to be validated as a packageId.
 * @returns {Result<string, Error>} a result that resolves to a {@link string} on
 * success or {@link Error} on failure.
 */
export declare function validatePackageId(input: string): Promise<Result<string, Error>>;
/**
 * A {@link ValidateFunction} that receives a {@link string} as input and resolves to a
 * {@link string} when successful. Verifies if the input is a valid SHA-256 fingerprint.
 * @param {string} input a string representing a SHA-256 fingerprint.
 * @returns {Result<string, Error>} a result that resolves to a {@link string} on
 * success or {@link Error} on failure.
 */
export declare function validateSha256Fingerprint(input: string): Promise<Result<string, Error>>;
