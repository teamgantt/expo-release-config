#!/usr/bin/env node
'use strict';

const {bump} = require('../lib/version');
const {beta} = require('../lib/config');

require('yargs')
  .command(
    'bump [type] [--commit] [--config]',
    'Increment the expo version.',
    yargs => {
      yargs.positional('type', {
        describe: 'Bump version type -- one of major, minor, patch or build.',
        default: 'patch',
      });
      yargs.positional('commit', {
        default: true,
        describe: 'Commit version files after bumping.',
        type: 'boolean',
      });
      yargs.positional('config', {
        default: 'app-config.json',
        describe: 'Location of your Expo app configuration file',
      });
    },
    async argv => {
      await bump(argv);
    }
  )
  .command(
    'config:beta [--config]',
    'Generate the beta expo configuration file.',
    yargs => {
      yargs.positional('config', {
        default: 'app-config.json',
        describe: 'Location of your expo app configuration file',
      });
    },
    async argv => {
      await beta(argv);
    }
  )
  .help().argv;
