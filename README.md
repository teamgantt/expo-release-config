# Expo Release Config
[![CircleCI](https://circleci.com/gh/teamgantt/expo-release-config/tree/develop.svg?style=svg)](https://circleci.com/gh/teamgantt/expo-release-config/tree/develop)

> Simple Expo release configuration tools.

## Goals

Provide a simple toolset to handle Expo releases with CI/CD. While everyone's implementation may vary for their apps, the hope is that the core configuration can be abstracted and aided by open source tooling.

## Overview

1. Production stand alone app released by iTunes Connect and Google Play Store wtih the `default` release channel.
2. Staging pre-release testing and QA on a secondary stand alone app that is served internally through TestFlight and Play Store. Configured with a secondary app.json with `default` release channel.
3. Feature level verification and testing on Expo client app with release channel named for the feature.
4. Local development is tested locally using the Expo client app pointing to your machine url.

Here is a simple breakdown of the release environment.

| Environment | Slug     | App         | Channel       |
| ----------- | -------- | ----------- | ------------- |
| Development | app      | Expo Client | localhost     |
| Feature QA  | app-beta | Expo Client | `feature/xxx` |
| Staging     | app-beta | App Beta    | `default`     |
| Production  | app      | App         | `default`     |

## Installation

1. Add the repo to your app's dependencies.

```bash
expo install expo-release-config
```

2. Expo Release Config will handle generating your app.json files for you. To organize your configuration, create an `expo-config.json` file in your root directory in the following format:

```json
{
  "prod": {
    "name": "My App",
    "slug": "my-app",
    "ios": {
      "bundleIdentifier": "com.myapp"
    }
  },
  "beta": {
    "extends": "prod",
    "slug": "my-app-beta",
    "ios": {
      "bundleIdentifier": "com.myapp.beta"
    }
  },
  ...
  "version": {
    "major": 1,
    "minor": 2,
    "patch": 0,
    "build": 10
  }
}
```
`"prod"` is the default app scheme. You can add any scheme you want by adding another root attribute with its name (ie beta, staging, sandbox, etc). The `"extends": "parent scheme"` attribute is used to merge your configurations together. This way, you only need to store the differences, not duplicated settings.

You'll also need a version object added if you want to track versioning.


## Usage
### `expo-config generate [scheme]`
Generates an Expo app.json configuration file based on the provided scheme.

This will deep merge attributes nested in the `[scheme]: {}` object of your app configuration file into the specified `"extends": "[scheme]"` scheme and save as a new file.

```bash
npx expo-config generate beta
```

Using the example `expo-config.json` file above, the result of this command would be the following:

`app.json`

```json
{
  "expo": {
    "name": "My App",
    "slug": "my-app-beta",
    "ios": {
      "bundleIdentifier": "com.myapp.beta"
    }
  }
}
```

### `expo-config version [type=patch] [--no-commit=false] [--print=false]`
Bumps the version file and updates the Expo app configuration, committing by default.

| Options | Default | Description |
| -- | -- | --|
| `type` | `patch` | One of `major`, `minor`, `patch`, `build`.
| `--no-commit` | false | Whether to commit the changed version files. Only commits `expo-config.json`.
| `--print` | false | Will output the next version for the bump without changing any files.

```bash
npx expo-config version minor --no-commit
```

| Version Type | Description |
| -- | -- |
| `major` | The major released version. |
| `minor` | The minor released version. Major + Minor version (ie `1.2`) will comprise the released standalone app version. |
| `patch` | The patch version. Will be incremented when publishing a new (over the air) update of your app. |
| `build` | The build number to specify `versionCode` (Android) and `buildNumber` (iOS). To simplify configuration the same number will be used for both OS. |

## Todo

- [ ] Publish app `default` with changes to `$PROD` branch.
- [ ] Publish app-beta `default` with changes to `/release/xxx` branch.
- [ ] Publish standalone app with tagged version.
- [ ] Publish standalone app-beta with changes to `/build/xxx` branch.
- [ ] Publish `/feature/xxx` with changes to `/feature/xxx`.
