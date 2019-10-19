import { resolve } from 'path';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { JsonObject } from '@angular-devkit/core';
import { NodeJsSyncHost } from '@angular-devkit/core/node';
import { BuilderContext, createBuilder } from '@angular-devkit/architect';

import loadConfig from '@react-native-community/cli/build/tools/config';
import { getDefaultUserTerminal } from '@react-native-community/cli-tools';
import runAndroid, {
  Flags
} from '@react-native-community/cli-platform-android/build/commands/runAndroid';

import { getProjectRoot } from '../../utils/source-root';

interface BuildOptions {}

interface BuildOutput {
  success: boolean;
}

export default createBuilder<BuildOptions & JsonObject>(run);

function run(
  buildOptions: BuildOptions,
  context: BuilderContext
): Observable<BuildOutput> {
  const host = new NodeJsSyncHost();

  return from(getProjectRoot(context, host)).pipe(
    map(projectRoot => ({
      projectRoot,
      options: normalizeOptions(context.workspaceRoot, projectRoot)
    })),
    switchMap(({ projectRoot, options }) =>
      from(runAndroid.func([], loadConfig(projectRoot), options)).pipe(
        map(() => ({ success: true }))
      )
    )
  );
}

function normalizeOptions(root: string, projectRoot: string): Flags {
  return {
    root: resolve(root, projectRoot),
    packager: false,
    variant: 'debug',
    appFolder: 'app',
    appId: '',
    appIdSuffix: '',
    mainActivity: 'MainActivity',
    port: 8081,
    terminal: getDefaultUserTerminal(),
    jetifier: true
  };
}
