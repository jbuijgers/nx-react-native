This library serves as an addition to [Nx](https://nrwl.io/nx) and will allow generating React Native apps.

### Attention

This library is still under heavy development.

# Getting Started

## Create a React Native app

```bash
yarn add --dev nx-react-native
nx g nx-react-native:app myapp com.myapp
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
