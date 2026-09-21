import { ParsedArgs } from 'minimist';
/**
 * Updates an existing TWA Project using the `twa-manifest.json`.
 * @param {string} [args.fieldsToIgnore] the fields that shouldn't be updated.
 */
export declare function merge(args: ParsedArgs): Promise<boolean>;
