import { ParsedArgs } from 'minimist';
/**
 * Runs the PwaValidator to check a given URL agains the Quality criteria. More information on the
 * Quality Criteria available at: https://web.dev/using-a-pwa-in-your-android-app/#quality-criteria
 * @param {ParsedArgs} args
 */
export declare function validate(args: ParsedArgs): Promise<boolean>;
