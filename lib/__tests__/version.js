const path = require('path');
const {execSync} = require('child_process');

const {saveJSONFile, getJSONFile} = require('../file-utils');
const {
  bumpVersion,
  getFullVersionName,
  getShortVersionName,
} = require('../version');

const fixtureFileName = path.join(__dirname, './tmp_version.json');

function getVersion() {
  return getJSONFile(fixtureFileName);
}

describe('versioning', () => {
  beforeEach(() => {
    return saveJSONFile(fixtureFileName, {
      major: 1,
      minor: 1,
      patch: 1,
      build: 1,
    });
  });

  afterAll(() => {
    return execSync(`rm ${fixtureFileName}`);
  });

  it('should get the version file', () => {
    return getVersion().then(version => {
      expect(getShortVersionName(version)).toBe('1.1');
      expect(getFullVersionName(version)).toBe('1.1.1');
    });
  });

  it('should stringify version correctly', () => {
    return getVersion().then(version => {
      expect(version.major).toBe(1);
    });
  });

  describe('bumpVersion()', () => {
    it('should bump the build correctly', () => {
      return bumpVersion('build', fixtureFileName)
        .then(getVersion)
        .then(version => {
          expect(version.major).toBe(1);
          expect(version.minor).toBe(1);
          expect(version.patch).toBe(1);
          expect(version.build).toBe(2);
        });
    });

    it('should reset patch and minor when bumping major', () => {
      return bumpVersion('major', fixtureFileName)
        .then(getVersion)
        .then(version => {
          expect(version.major).toBe(2);
          expect(version.minor).toBe(0);
          expect(version.patch).toBe(0);
          expect(version.build).toBe(1);
        });
    });

    it('should reset patch when bumping minor', () => {
      return bumpVersion('minor', fixtureFileName)
        .then(getVersion)
        .then(version => {
          expect(version.major).toBe(1);
          expect(version.minor).toBe(2);
          expect(version.patch).toBe(0);
          expect(version.build).toBe(1);
        });
    });

    it('should retain major and minor version when bumping patch', () => {
      return bumpVersion('patch', fixtureFileName)
        .then(getVersion)
        .then(version => {
          expect(version.major).toBe(1);
          expect(version.minor).toBe(1);
          expect(version.patch).toBe(2);
          expect(version.build).toBe(1);
        });
    });
  });
});
