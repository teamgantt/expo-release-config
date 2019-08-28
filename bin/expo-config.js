#!/usr/bin/env node
'use strict';

const {bump} = require('../lib/version');
const {generateConfig} = require('../lib/config');

require('yargs')
  .command(
    'generate [scheme]',
    'Generate the expo app.json configuration file for a given scheme.',
    yargs => {
      yargs.positional('scheme', {
        describe: 'Scheme to generate.',
        default: 'prod',
      });
    },
    async argv => {
      await generateConfig(argv.scheme);
    }
  )
  .command(
    'version [type] [--commit] [--print]',
    'Increment the configuration version.',
    yargs => {
      yargs.positional('type', {
        describe: 'Bump version type',
        default: 'patch',
        choices: ['major', 'minor', 'patch', 'build'],
      });
      yargs.positional('commit', {
        default: true,
        describe: 'Commit version files after bumping.',
        type: 'boolean',
      });
      yargs.positional('print', {
        default: false,
        describe: 'Display the version only',
        type: 'boolean',
      });
    },
    async argv => {
      await bump(argv);
    }
  )
  .help().argv;
