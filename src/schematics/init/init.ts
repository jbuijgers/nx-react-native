import { chain, Rule } from '@angular-devkit/schematics';
import { addDepsToPackageJson, updateJsonInTree } from '@nrwl/workspace';
import { Schema } from './schema';
import {
  frameworkVersion,
  typesVersion,
  reactVersion,
  reactTypesVersion,
  testingLibraryVersion,
  nxVersion,
  reactNativeCliVersion,
  metroPresetVersion,
  babelCoreVersion,
  babelRuntimeVersion,
  babelModuleResolverVersion
} from '../../utils/versions';

export function addDependencies(): Rule {
  return addDepsToPackageJson(
    {
      react: reactVersion,
      'react-native': frameworkVersion
    },
    {
      '@babel/core': babelCoreVersion,
      '@babel/runtime': babelRuntimeVersion,
      'nx-react-native': nxVersion,
      '@types/react': reactTypesVersion,
      '@types/react-native': typesVersion,
      '@testing-library/react-native': testingLibraryVersion,
      '@react-native-community/cli': reactNativeCliVersion,
      'babel-plugin-module-resolver': babelModuleResolverVersion,
      'metro-react-native-babel-preset': metroPresetVersion
    }
  );
}

function moveDependency(): Rule {
  return updateJsonInTree('package.json', json => {
    json.dependencies = json.dependencies || {};

    delete json.dependencies['nx-react-native'];
    return json;
  });
}

export default function(schema: Schema) {
  return chain([addDependencies(), moveDependency()]);
}
