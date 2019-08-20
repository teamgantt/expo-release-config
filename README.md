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

2. Create a `version.json` file in your app root directoy to track your current released version.

```json
{
  "major": 1,
  "minor": 2,
  "patch": 0,
  "build": 100
}
```

| Name    | Description                                                                                                                                      |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `major` | The major released version.                                                                                                                      |
| `minor` | The minor released version. Major + Minor version (ie `1.2`) will comprise the released standalone app version.                                  |
| `patch` | The patch version. Will be incremented when publishing a new (over the air) update of your app.                                                  |
| `build` | The build number to specify `versionCode` (Android) and `buildNumber` (iOS). To simplify configuration the same number will be used for both OS. |

## Usage

### `bump [type=patch] [--no-commit=false] [--config=app-config.json]`
Bumps the version file and updates the Expo app configuration, commiting by default.

| Options | Default | Description |
| -- | -- | --|
| `type` | `patch` | One of `major`, `minor`, `patch`, `build`.
| `--no-commit` | false |Wheter to commit the changed version files. Only commits `version.json` and your Expo app config.
| `--config` | `app-config.json` | Location of your Expo app config file.

```bash
npx expo-release bump minor --no-commit --config=my-app.json
```


## Todo

- [ ] Publish app `default` with changes to `$PROD` branch.
- [ ] Publish app-beta `default` with changes to `/release/xxx` branch.
- [ ] Publish standalone app with tagged version.
- [ ] Publish standalone app-beta with changes to `/build/xxx` branch.
- [ ] Publish `/feature/xxx` with changes to `/feature/xxx`.
