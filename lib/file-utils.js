'use strict';

const fs = require('fs');
const options = {encoding: 'utf-8'};

/**
 *
 * @param {string} filename
 * @returns {Promise<Object>} Promise that resolves the JSON object of parsed file.
 */
function getJSONFile(filename) {
  return new Promise(async resolve => {
    const file = fs.readFileSync(filename, options);

    resolve(JSON.parse(file));
  });
}

/**
 *
 * @param {string} filename
 * @param {Object} json
 * @returns {Promise} Promise that resolves true when the file is saved.
 */
function saveJSONFile(filename, json) {
  return new Promise(async resolve => {
    const string = `${JSON.stringify(json, null, 2)}\n`;
    fs.writeFileSync(filename, string, options);

    resolve(true);
  });
}

module.exports = {
  getJSONFile,
  saveJSONFile,
};
