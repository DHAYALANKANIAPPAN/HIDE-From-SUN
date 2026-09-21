import { Prompt } from '../Prompt';
import { TwaGenerator, TwaManifest } from '@bubblewrap/core';
/**
 * Wraps generating a project with a progress bar.
 */
export declare function generateTwaProject(prompt: Prompt, twaGenerator: TwaGenerator, targetDirectory: string, twaManifest: TwaManifest): Promise<void>;
/**
 * Compute the new app version.
 * @param {TwaManifest} oldTwaManifest current Twa Manifest.
 * @param {string | null} currentAppVersionName the current app's version name (or null) .
 * @param {Prompt} prompt prompt instance to get information from the user if needed.
 */
export declare function updateVersions(twaManifest: TwaManifest, currentAppVersionName: string | null, prompt?: Prompt): Promise<{
    appVersionName: string;
    appVersionCode: number;
}>;
export declare function computeChecksum(data: Buffer): string;
export declare function generateManifestChecksumFile(manifestFile: string, targetDirectory: string): Promise<void>;
/**
 * Update the TWA project.
 * @param skipVersionUpgrade {boolean} Skips upgrading appVersionCode and appVersionName if set to true.
 * @param appVersionName {string | null} Value to be used for appVersionName when upgrading
 * versions. Ignored if `args.skipVersionUpgrade` is set to true. If null, a default is used or user will be prompted for one.
 * @param prompt {Prompt} Prompt instance to get information from the user if necessary.
 * @param directory {string} TWA project directory.
 * @param manifest {string} Path to twa-manifest.json file.
 */
export declare function updateProject(skipVersionUpgrade: boolean, appVersionName: string | null, prompt: Prompt | undefined, directory: string, manifest: string): Promise<boolean>;
