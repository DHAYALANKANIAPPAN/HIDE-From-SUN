import { Prompt } from './Prompt';
/**
 * Install JDK 17 by downloading the binary and source code and
 * decompressing it. Source code is required
 * based on discussions with legal team about licensing.
 */
export declare class JdkInstaller {
    private prompt;
    private process;
    private downloadFile;
    private unzipFunction;
    private joinPath;
    /**
     * Constructs a new instance of JdkInstaller.
     *
     * @param process {NodeJS.Process} process information from the OS process.
     */
    constructor(process: NodeJS.Process, prompt: Prompt);
    /**
     * Downloads the platform-appropriate version of JDK 17, including
     * binary and source code.
     *
     * @param installPath {string} path to install JDK at.
     */
    install(installPath: string): Promise<string>;
}
