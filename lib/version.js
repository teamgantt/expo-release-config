'use strict';

const path = require('path');
const {getJSONFile, saveJSONFile} = require('./file-utils');

/**
 * JSON version file
 * @typedef {Object} VersionType
 * @property {number} major
 * @property {number} minor
 * @property {number} patch
 * @property {number} build
 */

const defaultVersionPath = path.join(__dirname, '../../../version.json');

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

module.exports = {
  bumpVersion,
};
