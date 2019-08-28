'use strict';

const {execSync} = require('child_process');
const {saveConfigFile, getJSONFile} = require('../file-utils');
const {generateConfig} = require('../config');

function getAppConfig() {
  return getJSONFile('app.json');
}

describe('config', () => {
  beforeEach(() => {
    return saveConfigFile({
      prod: {
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
        extends: 'prod',
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
    return execSync(`rm expo-config.json app.json`);
  });

  it('should throw an error if provided schema is not specified', async () => {
    try {
      await generateConfig('bla');
    } catch (e) {
      expect(e).toBe(
        'Scheme "bla" is not listed scheme in your expo-config.json file.'
      );
    }
  });

  it('should generate beta configuration file even if no overrides', () => {
    return saveConfigFile({
      prod: {
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
        extends: 'prod',
      },
    })
      .then(() => generateConfig('beta'))
      .then(getAppConfig)
      .then(config => {
        expect(config.expo.slug).toBe('my-app');
      });
  });

  it('should generate configuration file when no scheme provided', () => {
    return generateConfig()
      .then(getAppConfig)
      .then(config => {
        expect(config.expo.slug).toBe('my-app');
        expect(config.expo.name).toBe('My App');
        expect(config.expo.ios.bundleIdentifier).toBe('com.myapp');
      });
  });

  it('should generate configuration file for beta scheme', () => {
    return generateConfig('beta')
      .then(getAppConfig)
      .then(config => {
        expect(config.expo.slug).toBe('my-app-beta');
        expect(config.expo.name).toBe('My App');
        expect(config.expo.ios.bundleIdentifier).toBe('com.myapp.beta');
        expect(config.expo.android.package).toBe('com.myapp.beta');
        expect(config.expo.android.adaptiveIcon.foregroundImage).toBe(
          'my-beta-icon.png'
        );
        expect(config.expo).not.toContain({extends: 'prod'});
      });
  });
});
