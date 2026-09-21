"use strict";
/*
 * Copyright 2020 Google Inc. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.enUS = void 0;
const colors_1 = require("colors");
exports.enUS = {
    errorAssetLinksGeneration: 'Error generating "assetlinks.json"',
    errorCouldNotfindTwaManifest: (file) => {
        return `Could not load a manifest from: ${(0, colors_1.cyan)(file)}.`;
    },
    errorDirectoryDoesNotExist: (directory) => {
        return `Cannot write to directory: ${directory}.`;
    },
    errorIconUrlMustExist: (manifest) => {
        return `iconUrl field is missing from ${manifest}. Please add an iconUrl to continue.`;
    },
    errorFailedToRunQualityCriteria: (0, colors_1.yellow)('\nFailed to run the PWA Quality Criteria checks. Skipping.'),
    errorPlayBillingEnableNotifications: (0, colors_1.red)(`Play Billing requires ${(0, colors_1.cyan)('enableNotifications')} ` +
        `to be ${(0, colors_1.cyan)('true')}.`),
    errorMaxLength: (maxLength, actualLength) => {
        return `Maximum length is ${maxLength} but input is ${actualLength}.`;
    },
    errorMinLength: (minLength, actualLength) => {
        return `Minimum length is ${minLength} but input is ${actualLength}.`;
    },
    errorMissingArgument: (expected, received) => {
        return `Expected ${(0, colors_1.cyan)(expected.toString())} arguments \
but received ${(0, colors_1.cyan)(received.toString())}. Run ${(0, colors_1.cyan)('bubblewrap help')} for usage.`;
    },
    errorMissingManifestParameter: `Missing required parameter ${(0, colors_1.cyan)('--manifest')}`,
    errorRequireHttps: 'Url must be https.',
    errorInvalidUrl: (url) => {
        return `Invalid URL: ${url}`;
    },
    errorInvalidColor: (color) => {
        return `Invalid Color ${color}. Try using hexadecimal representation. eg: #FF3300`;
    },
    errorInvalidDisplayMode: (displayMode) => {
        return `Invalid display mode: ${displayMode}`;
    },
    errorInvalidOrientation: (orientation) => {
        return `Invalid orientation: ${orientation}`;
    },
    errorInvalidInteger: (integer) => {
        return `Invalid integer provided: ${integer}`;
    },
    errorInvalidSha256Fingerprint: (fingerprint) => {
        return `Invalid SHA-256 fingerprint ${(0, colors_1.red)(fingerprint)}.`;
    },
    errorUrlMustBeImage: (mimeType) => {
        return `URL must resolve to an image/* mime-type, but resolved to ${mimeType}.`;
    },
    errorSdkTerms: 'Downloading Android SDK failed because Terms and Conditions was not signed.',
    messageAddedFingerprint: (fingerprint) => {
        return `Added fingerprint with value ${fingerprint.value}.`;
    },
    messageAndroidAppDetails: (0, colors_1.underline)(`\nAndroid app details ${(0, colors_1.green)('(2/5)')}`),
    messageAndroidAppDetailsDesc: `
Please, enter details regarding how the Android app will look when installed
into a device:

\t- ${(0, colors_1.bold)('Application name:')} the name used in most places,
\t  including the App information screen and on the Play Store.

\t- ${(0, colors_1.bold)('Short name:')} an alternate name for the app, limited to
\t  12 characters, used on a device launch screen.

\t- ${(0, colors_1.bold)('Application ID:')} also known as ${(0, colors_1.italic)('Package Name')}, this is
\t  the unique identifier for the application on an Android device or
\t  the Play Store. The name must contain at least two segments,
\t  separated by dots, each segment must start with a letter and all
\t  characters must be alphanumeric or an underscore (_).

\t- ${(0, colors_1.bold)('Display mode:')} how the app will be displayed on the
\t  device screen when started. The default mode, used by most apps,
\t  is ${(0, colors_1.cyan)('standalone')}. ${(0, colors_1.cyan)('fullscreen')} causes the device status bar and
\t  navigation bars to be removed and is suitable for games or media
\t  players. For more information on the status bars and navigation
\t  bar on Android, go to:
\t   - ${(0, colors_1.cyan)('https://material.io/design/platform-guidance/android-bars.html')}.

\t- ${(0, colors_1.bold)('Status bar color:')} sets the status bar color used when the
\t  application is in foreground. Example: ${(0, colors_1.cyan)('#7CC0FF')}\n`,
    messageApkSuccess: (filename) => {
        return `\t- Generated Android APK at ${(0, colors_1.cyan)(filename)}`;
    },
    messageAppBundleSuccess: (filename) => {
        return `\t- Generated Android App Bundle at ${(0, colors_1.cyan)(filename)}`;
    },
    messageBuildingApp: '\nBuilding the Android App...',
    messageCallBubblewrapBuild: (0, colors_1.red)('\nCall: bubblewrap build\n to rebuild the project and enable uploading.'),
    messageDigitalAssetLinksSuccess: (filename) => {
        return `\t- Generated Digital Asset Links file at ${(0, colors_1.cyan)(filename)}
\nRead more about setting up Digital Asset Links at:
\t` + (0, colors_1.cyan)('https://developer.chrome.com/docs/android/trusted-web-activity/quick-start/#creating' +
            '-your-asset-link-file');
    },
    messageEnterPasswords: (keypath, keyalias) => {
        return `Please, enter passwords for the keystore ${(0, colors_1.cyan)(keypath)} and alias \
${(0, colors_1.cyan)(keyalias)}.\n`;
    },
    messageGeneratedAssetLinksFile: (outputfile) => {
        return `\nGenerated Digital Asset Links file at ${(0, colors_1.cyan)(outputfile)}.`;
    },
    messageGeneratingAndroidProject: 'Generating Android Project.',
    messageInstallingBuildTools: 'Installing Android Build Tools. Please, read and accept the ' +
        'license agreement.',
    messageInvalidTrack: 'The specified track was not found in the list of available tracks.',
    messageLauncherIconAndSplash: (0, colors_1.underline)(`\nLauncher icons and splash screen ${(0, colors_1.green)('(3/5)')}`),
    messageLauncherIconAndSplashDesc: `
The Android app requires an image for the launcher icon. It also displays a
splash screen while the web content is loading, to avoid displaying a flash of
a blank white page to users. 

\t- ${(0, colors_1.bold)('Splash screen color:')} sets the background colour used for the
\t  splash screen. Example: ${(0, colors_1.cyan)('#7CC0FF')}

\t- ${(0, colors_1.bold)('Icon URL:')} URL to an image that is at least 512x512px. Used to
\t  generate the launcher icon for the application and the image for
\t  the splash screen.

\t- ${(0, colors_1.bold)('Maskable Icon URL (Optional):')} URL to an image that is at least
\t  512x512px to be used when generating maskable icons. Maskable
\t  icons should look good when their edges are removed by an icon
\t  mask. They will be used to display adaptive launcher icons on the
\t  Android home screen.\n`,
    messageInitializingWebManifest: (manifestUrl) => {
        return `Initializing application from Web Manifest:\n\t-  ${(0, colors_1.cyan)(manifestUrl)}`;
    },
    messageLoadingTwaManifestFrom: (path) => {
        return `Loading TWA Manifest from: ${(0, colors_1.cyan)(path)}`;
    },
    messageNoChecksumFileFound: `
No checksum file was found to verify the state of the ${(0, colors_1.cyan)('twa-manifest.json')} file.
To make sure your project is up-to-date, would you like to regenerate your project?
If you are sure your project is updated and you have already run ${(0, colors_1.cyan)('bubblewrap update')}
then you may enter "no"`,
    messageNoChecksumNoUpdate: `
Project build will continue without regenerating project even though no checksum file was found.`,
    messageOptionFeatures: (0, colors_1.underline)(`\nOptional Features ${(0, colors_1.green)('(4/5)')}`),
    messageOptionalFeaturesDesc: `
\t- ${(0, colors_1.bold)('Include app shortcuts:')} This question is only prompted if a
\t  'shortcuts' section is available on the input Web Manifest. When
\t  answered “yes”, Bubblewrap uses the information to generate
\t  shortcuts on the Android app. Read more about app shortcuts at
\t  ${(0, colors_1.cyan)('https://web.dev/app-shortcuts/')}.

\t- ${(0, colors_1.bold)('Monochrome icon URL:')} URL to an image that is at least 48x48px to
\t  be used when generating monochrome icons. Monochrome icons should
\t  look good when displayed with a single color, the PWA's
\t  ${(0, colors_1.italic)('theme_color')}. They will be used for notification icons.\n`,
    messagePlayUploadSuccess: 'Project uploaded to Google Play Store',
    messageProjectGeneratedSuccess: '\nProject generated successfully. Build it by running ' +
        (0, colors_1.cyan)('bubblewrap build'),
    messageProjectUpdatedSuccess: '\nProject updated successfully.',
    messageProjectBuildReminder: 'Build it by running ' + (0, colors_1.cyan)('bubblewrap build'),
    messageProjectNotUpdated: '\nProject build will continue without newest ' +
        (0, colors_1.cyan)('twa-manifest.json') + ' changes.',
    messagePublishingWasNotSuccessful: 'Publishing the project was not successful.',
    messageRemovedFingerprint: (fingerprint) => {
        return `Removed fingerprint with value ${fingerprint.value}.`;
    },
    messageSavingTwaManifestTo: (path) => {
        return `Saving TWA Manifest to: ${(0, colors_1.cyan)(path)}`;
    },
    messageServiceAccountJSONMissing: 'Service account JSON could not be found on disk',
    messageSha256FingerprintNotFound: 'Could not find SHA256 fingerprint. Skipping generating ' +
        '"assetlinks.json"',
    messageSigningKeyCreation: (0, colors_1.underline)('\nSigning key creation'),
    messageSigningKeyInformation: (0, colors_1.underline)(`\nSigning key information ${(0, colors_1.green)('(5/5)')}`),
    messageSigningKeyInformationDesc: `
Please, enter information about the key store containing the keys that will be used
to sign the application. If a key store does not exist on the provided path,
Bubblewrap will prompt for the creation of a new keystore.

\t- ${(0, colors_1.bold)('Key store location:')} The location of the key store in the file
\t  system.

\t- ${(0, colors_1.bold)('Key name:')} The alias used on the key.

Read more about Android signing keys at:
\t ${(0, colors_1.cyan)('https://developer.android.com/studio/publish/app-signing')}\n`,
    messageSigningKeyNotFound: (path) => {
        return `\nAn existing key store could not be found at "${path}".\n`;
    },
    messageUpgradedAppVersion: (appVersionName, appVersionCode) => {
        return `Upgraded app version to versionName: ${appVersionName} and ` +
            `versionCode: ${appVersionCode}`;
    },
    messageUsingPasswordsFromEnv: 'Using passwords set in the BUBBLEWRAP_KEYSTORE_PASSWORD and ' +
        'BUBBLEWRAP_KEY_PASSWORD environmental variables.',
    messageWebAppDetails: (0, colors_1.underline)(`\nWeb app details ${(0, colors_1.green)('(1/5)')}`),
    messageWebAppDetailsDesc: `
The application generated by Bubblewrap will open a Progressive Web App when
started from the Android launcher. Please enter the following details about
the PWA:
  
\t- ${(0, colors_1.bold)('Domain:')} the domain / origin where the PWA is hosted. 
\t  Example: ${(0, colors_1.cyan)('example.com')}

\t- ${(0, colors_1.bold)('URL path:')} an URL path relative to the root of the origin,
\t  opened when the application is started from the home screen.
\t  Examples:

\t\t- To open ${(0, colors_1.italic)('https://example.com/')}: ${(0, colors_1.cyan)('/')}
\t\t- To open ${(0, colors_1.italic)('https://example.com/path-to-pwa/')}: ${(0, colors_1.cyan)('/path-to-pwa/')}\n`,
    messageDownloadJdk: 'Downloading JDK 17 to ',
    messageDownloadSdk: 'Downloading Android SDK to ',
    messageDownloadJdkSrc: 'Downloading the JDK 17 Sources...',
    messageDecompressJdkSrc: 'Decompressing the JDK 17 Sources...',
    messageDownloadJdkBin: 'Downloading the JDK 17 Binaries...',
    messageDecompressJdkBin: 'Decompressing the JDK 17 Binaries...',
    messageDownloadAndroidSdk: 'Downloading the Android SDK...',
    messageDecompressAndroidSdk: 'Decompressing the Android SDK...',
    promptCreateDirectory: (directory) => {
        return `Directory ${(0, colors_1.cyan)(directory)} does not exist. Do you want to create it now?`;
    },
    promptExperimentalFeature: 'This is an experimental feature. Are you sure you want to continue?',
    promptInstallJdk: `Do you want Bubblewrap to install the JDK (recommended)?
  (Enter "No" to use your own JDK 17 installation)`,
    promptJdkPath: 'Path to your existing JDK 17:',
    promptInstallSdk: `Do you want Bubblewrap to install the Android SDK (recommended)?
  (Enter "No" to use your own Android SDK installation)`,
    promptSdkTerms: `Do you agree to the Android SDK terms and conditions at ${(0, colors_1.underline)('https://developer.android.com/studio/terms.html')}?`,
    promptSdkPath: 'Path to your existing Android SDK:',
    promptHostMessage: 'Domain:',
    promptName: 'Application name:',
    promptLauncherName: 'Short name:',
    promptDisplayMode: 'Display mode:',
    promptOrientation: 'Orientation:',
    promptThemeColor: 'Status bar color:',
    promptBackgroundColor: 'Splash screen color:',
    promptStartUrl: 'URL path:',
    promptIconUrl: 'Icon URL:',
    promptMaskableIconUrl: 'Maskable icon URL:',
    promptMonochromeIconUrl: 'Monochrome icon URL:',
    promptShortcuts: 'Include app shortcuts?',
    promptPlayBilling: 'Include support for Play Billing?',
    promptLocationDelegation: 'Request geolocation permission?',
    promptPackageId: 'Application ID:',
    promptKeyPath: 'Key store location:',
    promptKeyAlias: 'Key name:',
    promptCreateKey: 'Do you want to create one now?',
    promptKeyFullName: 'First and Last names (eg: John Doe):',
    promptKeyOrganizationalUnit: 'Organizational Unit (eg: Engineering Dept):',
    promptKeyOrganization: 'Organization (eg: Company Name):',
    promptKeyCountry: 'Country (2 letter code):',
    promptKeystorePassword: 'Password for the Key Store:',
    promptKeyPassword: 'Password for the Key:',
    promptNewAppVersionName: 'versionName for the new App version:',
    promptVersionCode: 'Starting version code for the new app version:',
    promptVersionMismatch: (currentVersion, playStoreVerison) => {
        return `The current play store version (${(0, colors_1.cyan)(playStoreVerison)}) is higher than your twa
    manifest version (${(0, colors_1.cyan)(currentVersion)}). Do you want to update your TWA Manifest version
    now?`;
    },
    promptUpdateProject: 'There are changes in twa-manifest.json. ' +
        'Would you like to apply them to the project before building?',
    warnFamilyPolicy: (0, colors_1.bold)((0, colors_1.yellow)('WARNING: ')) + 'Trusted Web Activities are currently incompatible' +
        ' with applications\ntargeting children under the age of 13.' +
        ' Check out the Play for' +
        ' Families\npolicies to learn more.\n' +
        (0, colors_1.cyan)('https://play.google.com/console/about/families/'),
    warnIncreasingMinSdkVersion: (0, colors_1.bold)((0, colors_1.yellow)('WARNING: ')) + `The minimum Android API Level (${(0, colors_1.cyan)('minSdkVersion')}) has ` +
        `been increased\nfrom ${(0, colors_1.cyan)('19')} to ${(0, colors_1.cyan)('23')} because the ${(0, colors_1.cyan)('--metaquest')} ` +
        'flag is used.',
    warnPwaFailedQuality: (0, colors_1.red)('PWA Quality Criteria check failed.'),
    updateConfigUsage: 'Usage: [--jdkPath <path-to-jdk>] [--androidSdkPath <path-to-android-sdk>]' +
        '(You can insert one or both of them)',
    jdkPathIsNotCorrect: 'The jdkPath isn\'t correct, please run the following command to update ' +
        'it:\nbubblewrap updateConfig --jdkPath <path-to-jdk>, such that the folder of the path' +
        'contains the file "release". Then run bubblewrap doctor again.',
    jdkIsNotSupported: 'Unsupported jdk version. Please download "OpenJDK 17(LTS)" at the link ' +
        'below:\nhttps://adoptium.net/temurin/releases/?version=17&package=jdk.',
    androidSdkPathIsNotCorrect: 'The androidSdkPath isn\'t correct, please run the following ' +
        'command to update it:\nbubblewrap updateConfig --androidSdkPath <path-to-sdk>, such that ' +
        'the folder of the path contains the folder "build". Then run bubblewrap doctor again.',
    bothPathsAreValid: 'Your jdkpath and androidSdkPath are valid.',
    versionDoesNotExistOnServer: 'The supplied version code does not exist on the Google Play' +
        ' Servers.',
    versionToRetainHigherThanBuildVersion: (currentVersion, versionToRetain) => {
        return `The version to retain (${(0, colors_1.cyan)(versionToRetain.toString())}) is currently higher than
      the current version you want to publish (${(0, colors_1.cyan)(currentVersion.toString())}).`;
    },
    versionRetainedNotAnInteger: 'The retained version code must be an integer.',
};
