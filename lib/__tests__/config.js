'use strict';

const {execSync} = require('child_process');
const path = require('path');
const {saveJSONFile, getJSONFile} = require('../file-utils');
const {beta, getBetaConfigFilename, generateConfig} = require('../config');

const fixtureFileName = path.join(__dirname, './app-config.json');
const fixtureFileNameBeta = path.join(__dirname, './app-config-beta.json');

function getBetaConfig() {
  return getJSONFile(fixtureFileNameBeta);
}

describe('config', () => {
  beforeEach(() => {
    return saveJSONFile(fixtureFileName, {
      expo: {
        name: 'My App',
        slug: 'my-app',
        version: '1.1',
        ios: {
          bundleIdentifier: 'com.myapp',
          icon: 'my-icon.png',
        },
        android: {
          package: 'com.myapp.android',
          adaptiveIcon: {
            foregroundImage: 'my-icon.png',
            backgroundColor: 'red',
          },
        },
      },
      beta: {
        slug: 'my-app-beta',
        ios: {
          bundleIdentifier: 'com.myapp.beta',
        },
        android: {
          package: 'com.myapp.beta',
          adaptiveIcon: {
            foregroundImage: 'my-beta-icon.png',
          },
        },
      },
    });
  });

  afterAll(() => {
    return execSync(`rm ${fixtureFileName} ${fixtureFileNameBeta}`);
  });

  it('should generate beta configuration filename', () => {
    expect(getBetaConfigFilename(fixtureFileName)).toBe(fixtureFileNameBeta);
  });

  it('should generate beta configuration file even if no overrides', () => {
    return saveJSONFile(fixtureFileName, {
      expo: {
        name: 'My App',
        slug: 'my-app',
        version: '1.1',
        ios: {
          bundleIdentifier: 'com.myapp',
          icon: 'my-icon.png',
        },
        android: {
          package: 'com.myapp.android',
          adaptiveIcon: {
            foregroundImage: 'my-icon.png',
            backgroundColor: 'red',
          },
        },
      },
    })
      .then(() => beta({config: fixtureFileName}))
      .then(getBetaConfig)
      .then(config => {
        expect(config.expo.slug).toBe('my-app');
      });
  });

  it('should generate beta configuration file with generateConfig()', () => {
    return beta({config: fixtureFileName})
      .then(getBetaConfig)
      .then(config => {
        expect(config.expo.slug).toBe('my-app-beta');
        expect(config.expo.name).toBe('My App');
        expect(config.expo.ios.bundleIdentifier).toBe('com.myapp.beta');
        expect(config.expo.android.package).toBe('com.myapp.beta');
        expect(config.expo.android.adaptiveIcon.foregroundImage).toBe(
          'my-beta-icon.png'
        );
      });
  });
});
