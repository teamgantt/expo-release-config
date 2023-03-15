const {execSync} = require('child_process');

const {saveConfigFile, getConfigFile} = require('../file-utils');
const {
  bumpVersion,
  bump,
  getFullVersionName,
  getShortVersionName,
} = require('../version');

describe('versioning', () => {
  beforeEach(() => {
    return saveConfigFile({
      prod: {
        version: '1.1.1',
        ios: {
          buildNumber: '1',
        },
        android: {
          versionCode: 1,
        },
      },
      version: {
        major: 1,
        minor: 1,
        patch: 1,
        build: 1,
      },
    });
  });

  afterAll(() => {
    return execSync(`rm expo-config.json`);
  });

  it('should get the version file', () => {
    return getConfigFile().then(({version}) => {
      expect(getShortVersionName(version)).toBe('1.1');
      expect(getFullVersionName(version)).toBe('1.1.1');
    });
  });

  it('should stringify version correctly', () => {
    return getConfigFile().then(({version}) => {
      expect(version.major).toBe(1);
    });
  });

  it('should bump the build correctly', () => {
    return bumpVersion({type: 'build'})
      .then(getConfigFile)
      .then(({version, prod}) => {
        expect(version.major).toBe(1);
        expect(version.minor).toBe(1);
        expect(version.patch).toBe(1);
        expect(version.build).toBe(2);
        expect(prod.version).toBe('1.1.1');
      });
  });

  it('should reset patch and minor when bumping major', () => {
    return bumpVersion({type: 'major'})
      .then(getConfigFile)
      .then(({version, prod}) => {
        expect(version.major).toBe(2);
        expect(version.minor).toBe(0);
        expect(version.patch).toBe(0);
        expect(version.build).toBe(1);
        expect(prod.version).toBe('2.0.0');
      });
  });

  it('should reset patch when bumping minor', () => {
    return bumpVersion({type: 'minor'})
      .then(getConfigFile)
      .then(({version, prod}) => {
        expect(version.major).toBe(1);
        expect(version.minor).toBe(2);
        expect(version.patch).toBe(0);
        expect(version.build).toBe(1);
        expect(prod.version).toBe('1.2.0');
      });
  });

  it('should retain major and minor version when bumping patch', () => {
    return bumpVersion({type: 'patch'})
      .then(getConfigFile)
      .then(({version, prod}) => {
        expect(version.major).toBe(1);
        expect(version.minor).toBe(1);
        expect(version.patch).toBe(2);
        expect(version.build).toBe(1);
        expect(prod.version).toBe('1.1.2');
      });
  });

  it('should not change files when passing --print', () => {
    return bumpVersion({type: 'patch', print: true})
      .then(getConfigFile)
      .then(({version, prod}) => {
        expect(version.major).toBe(1);
        expect(version.minor).toBe(1);
        expect(version.patch).toBe(1);
        expect(version.build).toBe(1);
        expect(prod.version).toBe('1.1.1');
      });
  });

  it('should update the expo version number', () => {
    return bump({type: 'minor', commit: false})
      .then(getConfigFile)
      .then(config => {
        expect(config.prod.version).toBe('1.2.0');
      });
  });

  it('should update the expo build', () => {
    return bump({type: 'build', commit: false})
      .then(getConfigFile)
      .then(config => {
        expect(config.prod.ios.buildNumber).toBe('2');
        expect(config.prod.android.versionCode).toBe(2);
      });
  });
});
