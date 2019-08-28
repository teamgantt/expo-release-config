'use strict';

const {execSync} = require('child_process');
const {getConfigFile, saveConfigFile} = require('./file-utils');

/**
 * JSON version file
 * @typedef {Object} VersionType
 * @property {number} major
 * @property {number} minor
 * @property {number} patch
 * @property {number} build
 */

/**
 *
 * @param {Object} options
 * @param {string} options.type
 * @param {boolean} options.commit
 * @param {boolean} options.print
 */
async function bump(options) {
  const version = await bumpVersion(options);

  const fullVersionName = getFullVersionName(version);
  const shortVersionName = getShortVersionName(version);

  if (options.print) {
    console.log(fullVersionName);
    return;
  }

  const expoConfig = await getConfigFile();

  expoConfig.prod.version = shortVersionName;
  try {
    expoConfig.prod.ios.buildNumber = `${version.build}`;
    expoConfig.prod.android.versionCode = version.build;
  } catch (e) {
    // noop
  }

  await saveConfigFile(expoConfig);

  const includeBuildNumber = `${
    options.type === 'build' ? `, build ${version.build}` : ''
  }`;

  console.log(
    `Version successfully bumped to ${fullVersionName}${includeBuildNumber}.`
  );

  if (options.commit) {
    await execSync(
      `git add expo-config.json && git commit -m "Version bumped to ${fullVersionName}${includeBuildNumber}"`
    );
    console.log('Committed files to git.');
  }
}

/**
 *
 * @param {Object} options
 * @param {('major'|'minor'|'patch'|'build')} options.type
 * @param {boolean} options.print
 * @returns {VersionType} JSON object of the updated version.
 */
async function bumpVersion({type = 'patch', print = false}) {
  const expoConfig = await getConfigFile();
  const version = expoConfig.version || {
    major: 0,
    minor: 0,
    patch: 0,
    build: 0,
  };

  switch (type) {
    case 'major':
      version.major++;
      version.minor = 0;
      version.patch = 0;
      break;
    case 'minor':
      version.minor++;
      version.patch = 0;
      break;
    case 'build':
      version.build++;
      break;
    case 'patch':
      version.patch++;
      break;
  }

  if (!print) {
    expoConfig.version = version;

    await saveConfigFile(expoConfig);
  }

  return version;
}

/**
 * Returns the full semantic version string.
 * @param {VersionType} Version
 * @returns {string} x.x.x version
 */
function getFullVersionName(version) {
  return `${version.major}.${version.minor}.${version.patch}`;
}

/**
 * Returns the major/minor version string.
 * @param {VersionType} Version
 * @returns {string} x.x version
 */
function getShortVersionName(version) {
  return `${version.major}.${version.minor}`;
}

module.exports = {
  bump,
  bumpVersion,
  getFullVersionName,
  getShortVersionName,
};
