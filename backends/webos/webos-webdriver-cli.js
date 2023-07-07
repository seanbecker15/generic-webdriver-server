#!/usr/bin/env node
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


const yargs = require('yargs');
const {loadOnWebOS, addWebOSArgs} =
    require('./webos-utils');

yargs
    .strict()
    .usage('Usage: $0 --device=<ARES DEVICE NAME> --url=<URL>')
    .usage('   or: $0 --device=<ARES DEVICE NAME> --home')
    .option('url', {
      description: 'A URL to direct the webos device to.\n' +
                   'Either --url or --home must be specified.',
      type: 'string',
    })
    .option('home', {
      description: 'Direct the webos device to the home screen.\n' +
                   'Either --url or --home must be specified.',
      type: 'boolean',
    })
    // You can't use more than one of these at once.
    .conflicts('url', 'home')
    .check((flags) => {
      // Enforce that one or the other is specified.
      if (!flags.url && !flags.home) {
        throw new Error(
            'Either --url or --home must be specified.');
      }

      return true;
    });

addWebOSArgs(yargs);

const flags = yargs.argv;

(async () => {
  try {
    await loadOnWebOS(flags, /* log= */ console, flags.url);
  } catch (error) {
    console.error(error);
  }
})();
