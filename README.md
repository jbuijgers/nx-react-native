This library serves as an addition to [Nx](https://nrwl.io/nx) and will allow generating React Native apps.

### Attention

This library is still under heavy development.

# Getting Started

## Install the latest React Native CLI

This plugin will not work without it, due to how @react-native-community/cli is set up.

```bash
npm i -g @react-native-community/cli@next
```

## Create a React Native app

```bash
yarn add --dev @jbuijgers/nx-react-native
nx g @jbuijgers/nx-react-native:app myapp com.myapp
```

## Fix a temporary bug

```bash
chmod a+x apps/myapp/android/gradlew
```

## Run the application

```bash
nx serve myapp
nx build myapp
```
