import type { ParsedArgs } from 'minimist';
import { Prompt } from '../Prompt';
export declare function fingerprint(args: ParsedArgs, prompt?: Prompt): Promise<boolean>;
