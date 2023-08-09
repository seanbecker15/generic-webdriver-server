/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const fs = require('fs-extra');
const path = require('path');
const tmp = require('tmp-promise');
const util = require('util');

const execFile = util.promisify(require('child_process').execFile);

const appTemplatePath = path.resolve(__dirname, 'app-template');

/**
 * Uses ares cli to connect to a WebOS device, install a temporary hosted web
 * container app, and load a URL into it.
 *
 * @param {!object<string, ?>} flags Parsed command-line flags.
 * @param {Console} log A Console-like interface for logging.  Can be "console".
 * @param {?string} url If non-null, install the WebOS container app and load
 *   the URL into it.  If null, uninstall and send the WebOS device
 *   back to the home screen.
 * @return {!Promise}
 */
async function loadOnWebOS(flags, log, url) {
  if (url) {
    // Copy the app template into a temporary directory.
    const tmpDirOptions = {
      mode: 0o700, // Only accessible to the owner
      prefix: 'webos-webdriver-server-',
      unsafeCleanup: true, // Remove directory contents on cleanup
    };
    const tmpDir = await tmp.dir(tmpDirOptions);

    try {
      log.info('Preparing app template');
      fs.copySync(appTemplatePath, tmpDir.path);
      setAppUrl(tmpDir.path, url);
      log.info('Building app');
      await buildApp(tmpDir.path);
      log.info('Installing app');
      await installApp(
          flags.device,
          'com.webdriver.app_1.0.0_all.ipk',
          tmpDir.path,
      );
      log.info('Launching app');
      await launchApp(flags.device, 'com.webdriver.app');
    } finally {
      // Remove our temporary directory.
      tmpDir.cleanup();
    }
  } else {
    log.info('Uninstalling app');
    await uninstallApp(flags.device, 'com.webdriver.app');
  }
  log.info('Done');
}

/**
 * Set the URL for the application template.
 *
 * @param {string} tempPath The temp folder in which the application template
 *   can be found.
 * @param {string} url The destination URL.
 */
function setAppUrl(tempPath, url) {
  // Fill in the desired destination URL in the app source.
  const mainHtmlPath = path.resolve(tempPath, 'index.html');
  const originalHtml = fs.readFileSync(mainHtmlPath).toString('utf8');
  const modifiedHtml = originalHtml.replace('DESTINATION', url);
  fs.writeFileSync(mainHtmlPath, modifiedHtml);
}

/**
 * Build the application in the temp path.
 *
 * @param {string} tempPath The temp folder in which the application template
 *   can be found.
 * @return {!Promise}
 */
async function buildApp(tempPath) {
  const command = `ares-package -o ${tempPath} ${tempPath}`;

  // @todo remove after debugging?
  await execFile('bash', ['-c', 'echo', `"${command}"`]);

  // Build the app using bash
  await execFile('bash', ['-c', command]);
}

/**
 * Install the application to the specified WebOS device.
 *
 * @param {string} deviceName The name of the WebOS device.
 *   Use `ares-setup-device --list` to find the device name.
 * @param {string} packageFile The full name of the file output
 *   by the build command.
 * @param {string} tempPath The path to the temp folder in
 *   which the application template can be found.
 * @return {!Promise}
 */
async function installApp(deviceName, packageFile, tempPath) {
  const tempPackagePath = path.resolve(tempPath, packageFile);
  const command = `ares-install ${tempPackagePath} -d "${deviceName}"`;

  // @todo remove after debugging?
  await execFile('bash', ['-c', 'echo', `"${command}"`]);

  // Build the app using bash
  await execFile('bash', ['-c', command]);
}

/**
 * Launch the application on the specified WebOS device.
 *
 * @param {string} deviceName deviceName The name of the WebOS device.
 *   Use `ares-setup-device --list` to find the device name.
 * @param {string} packageName The name of the WebOS package to launch.
 * @return {!Promise}
 */
async function launchApp(deviceName, packageName) {
  const command = `ares-launch ${packageName} -d "${deviceName}"`;

  // @todo remove after debugging?
  await execFile('bash', ['-c', 'echo', `"${command}"`]);

  // Build the app using bash
  await execFile('bash', ['-c', command]);
}

/**
 * Uninstall the application from the specified WebOS device.
 *
 * @param {string} deviceName deviceName The name of the WebOS device.
 *   Use `ares-setup-device --list` to find the device name.
 * @param {string} packageName The name of the WebOS package to uninstall.
 * @return {!Promise}
 */
async function uninstallApp(deviceName, packageName) {
  const command = `ares-install -r ${packageName} -d "${deviceName}"`;

  // @todo remove after debugging?
  await execFile('bash', ['-c', 'echo', `"${command}"`]);

  // Close the app using bash
  await execFile('bash', ['-c', command]);
}

/**
 * Add WebOS-specific arguments to the application's argument parser (from
 * the "yargs" module).
 *
 * @param {Yargs} yargs The argument parser object from "yargs".
 */
function addWebOSArgs(yargs) {
  yargs
      .option('hostname', {
        description:
        'The webos hostname or IP address, with optional port ' +
        'number (default port number is 8009)',
        type: 'string',
        demandOption: true,
      })
      .option('device', {
        description:
        'The webos device name as specified in the ares cli' +
        '(find a device using the command `ares-setup-device --list`)',
        type: 'string',
        demandOption: true,
      });
}

module.exports = {
  loadOnWebOS,
  addWebOSArgs,
};
