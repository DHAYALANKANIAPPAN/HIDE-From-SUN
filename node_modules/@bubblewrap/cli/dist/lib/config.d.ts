import { Config, Log } from '@bubblewrap/core';
import { Prompt } from './Prompt';
export declare const DEFAULT_CONFIG_FILE_PATH: string;
export declare function loadOrCreateConfig(log?: Log, prompt?: Prompt, path?: string): Promise<Config>;
