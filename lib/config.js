'use strict';

const deepmerge = require('deepmerge');
const {getConfigFile, saveJSONFile} = require('./file-utils');

/**
 *
 * @param {string} scheme
 */
async function generateConfig(scheme = 'prod') {
  const expoConfig = await getConfigFile();

  const schemeConfig = expoConfig[scheme];

  if (!schemeConfig) {
    return Promise.reject(
      `Scheme "${scheme}" is not listed scheme in your expo-config.json file.`
    );
  }

  const newConfig = {
    expo: deepmerge(expoConfig[schemeConfig.extends] || {}, schemeConfig),
  };

  delete newConfig.expo.extends;

  await saveJSONFile('app.json', newConfig);

  console.log(`Successfully created expo configuration file.`);

  return Promise.resolve();
}

module.exports = {
  generateConfig,
};
