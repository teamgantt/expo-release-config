'use strict';

const deepmerge = require('deepmerge');
const {getJSONFile, saveJSONFile} = require('./file-utils');

/**
 *
 * @param {Object} options
 * @param {string} options.config
 */
async function beta(options) {
  const appConfig = await getJSONFile(options.config);

  const betaConfigFilename = getBetaConfigFilename(options.config);
  const betaConfig = await generateConfig(
    {expo: appConfig.expo},
    {expo: appConfig.beta || appConfig.expo},
    betaConfigFilename
  );

  console.log(
    `Successfully created beta configuration file at ${betaConfigFilename}.`
  );
}

/**
 *
 * @param {Object} baseConfig
 * @param {Object} override
 * @param {string} filename
 * @returns {Object} new configuration
 */
async function generateConfig(baseConfig, override, filename) {
  const newConfig = deepmerge(baseConfig, override);

  await saveJSONFile(filename, newConfig);

  return newConfig;
}

/**
 *
 * @param {string} appConfigFilename
 * @returns {string} beta filename
 */
function getBetaConfigFilename(appConfigFilename) {
  return appConfigFilename.replace('.json', '-beta.json');
}

module.exports = {
  beta,
  generateConfig,
  getBetaConfigFilename,
};
