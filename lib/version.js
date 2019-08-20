'use strict';

const {execSync} = require('child_process');
const {getJSONFile, saveJSONFile} = require('./file-utils');

/**
 * JSON version file
 * @typedef {Object} VersionType
 * @property {number} major
 * @property {number} minor
 * @property {number} patch
 * @property {number} build
 */

const defaultVersionPath = './version.json';

/**
 *
 * @param {Object} options
 * @param {string} options.type
 * @param {boolean} options.commit
 * @param {string} options.config
 */
async function bump(options) {
  const version = await bumpVersion(options.type);

  const fullVersionName = getFullVersionName(version);
  const shortVersionName = getShortVersionName(version);

  const appConfig = await getJSONFile(options.config);

  appConfig.expo.version = shortVersionName;
  try {
    appConfig.expo.ios.buildNumber = version.build;
    appConfig.expo.android.versionCode = version.build;
  } catch (e) {}

  await saveJSONFile(options.config, appConfig);

  const includeBuildNumber = `${
    options.type === 'build' ? `, build ${version.build}` : ''
  }`;

  console.log(
    `Version sucesfully bumped to ${fullVersionName}${includeBuildNumber}.`
  );

  if (options.commit) {
    await execSync(
      `git add ./version.json ${options.config} && git commit -m "Version bumped to ${fullVersionName}${includeBuildNumber}"`
    );
    console.log('Commited files to git.');
  }
}

/**
 *
 * @param {('major'|'minor'|'patch'|'build')} type
 * @param {string} [versionFileName=version.json] defaults to version.json in the directory containing node_modules.
 * @returns {VersionType} JSON object of the updated version.
 */
async function bumpVersion(
  type = 'patch',
  versionFileName = defaultVersionPath
) {
  const version = await getJSONFile(versionFileName);

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

  await saveJSONFile(versionFileName, version);

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
