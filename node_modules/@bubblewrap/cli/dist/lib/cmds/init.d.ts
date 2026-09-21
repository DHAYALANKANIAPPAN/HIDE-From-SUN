import { Config } from '@bubblewrap/core';
import { Prompt } from '../Prompt';
export interface InitArgs {
    manifest?: string;
    directory?: string;
    chromeosonly?: boolean;
    metaquest?: boolean;
    alphaDependencies?: boolean;
}
export declare function init(args: InitArgs, config: Config, prompt?: Prompt): Promise<boolean>;
