import type { ParsedArgs } from 'minimist';
import { Prompt } from '../Prompt';
export interface PlayArgs extends ParsedArgs {
    track?: string;
    serviceAccountFile?: string;
    manifest?: string;
    appBundleLocation?: string;
    targetDirectory?: string;
    retain?: number;
    remove?: number;
    list?: boolean;
    add?: number;
}
export declare function play(args: PlayArgs, prompt?: Prompt): Promise<boolean>;
