import { Prompt } from './Prompt';
/**
 * Install Android Command Line Tools by downloading the zip and
 * decompressing it.
 */
export declare class AndroidSdkToolsInstaller {
    private process;
    private prompt;
    constructor(process: NodeJS.Process, prompt: Prompt);
    /**
     * Downloads the platform-appropriate version of Android
     * Command Line Tools.
     *
     * @param installPath {string} path to install SDK at.
     */
    install(installPath: string): Promise<void>;
}
