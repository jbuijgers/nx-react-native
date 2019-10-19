import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { JsonObject } from '@angular-devkit/core';
import { NodeJsSyncHost } from '@angular-devkit/core/node';
import { BuilderContext, createBuilder } from '@angular-devkit/architect';

import { resolve } from 'path';

import loadConfig from '@react-native-community/cli/build/tools/config';
import runServer from '@react-native-community/cli/build/commands/server/runServer';

import { getProjectRoot } from '../../utils/source-root';

interface ServeOptions {}

interface ServeOutput {
  success: boolean;
}

export default createBuilder<ServeOptions & JsonObject>(run);

function run(
  serveOptions: ServeOptions,
  context: BuilderContext
): Observable<ServeOutput> {
  const host = new NodeJsSyncHost();

  return from(getProjectRoot(context, host)).pipe(
    map(projectRoot => ({
      projectRoot,
      options: normalizeOptions(context.workspaceRoot, projectRoot)
    })),
    switchMap(
      ({ projectRoot, options }) =>
        new Observable<ServeOutput>(obs => {
          const server = from(runServer([], loadConfig(projectRoot), options));

          obs.next({ success: true });

          const subscription = server.subscribe();

          return () => subscription.unsubscribe();
        })
    )
  );
}

function normalizeOptions(root: string, projectRoot: string): ServeOptions {
  return {
    config: resolve(root, projectRoot, 'metro.config.js')
  };
}
