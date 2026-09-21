import { Prompt } from '../Prompt';
import { ParsedArgs } from 'minimist';
/**
 * Updates an existing TWA Project using the `twa-manifest.json`.
 * @param {string} [args.manifest] directory where the command should look for the
 * `twa-manifest.json`. Defaults to the current folder.
 * @param {boolean} [args.skipVersionUpgrade] Skips upgrading appVersionCode and appVersionName
 * if set to true.
 * @param {string} [args.appVersionName] Value to be used for appVersionName when upgrading
 * versions. Ignored if `args.skipVersionUpgrade` is set to true.
 */
export declare function update(args: ParsedArgs, prompt?: Prompt): Promise<boolean>;
