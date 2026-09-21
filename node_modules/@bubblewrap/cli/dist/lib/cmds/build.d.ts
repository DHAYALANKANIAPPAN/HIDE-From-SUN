import { Config, Log } from '@bubblewrap/core';
import { Prompt } from '../Prompt';
import { ParsedArgs } from 'minimist';
export declare function build(config: Config, args: ParsedArgs, log?: Log, prompt?: Prompt): Promise<boolean>;
