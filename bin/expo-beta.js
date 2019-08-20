#!/usr/bin/env node

const {spawn, fork} = require('child_process');
const unparse = require('yargs-unparser');
const {getBetaConfigFilename} = require('../lib/config');

const argv = require('yargs').option('config', {
  default: 'app-config.json',
  describe: 'Location of your Expo app configuration file',
}).argv;

const betaConfigFilename = getBetaConfigFilename(argv.config);

argv.config = betaConfigFilename;

console.log(
  `Running expo-cli ${argv._[0]} with --config=${betaConfigFilename}...`
);

const child = spawn('npx expo', unparse(argv), {
  shell: true,
  stdio: [process.stdin, process.stdout, process.stderr],
});
