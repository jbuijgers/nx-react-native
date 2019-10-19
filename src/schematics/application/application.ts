import { normalize, Path, join } from '@angular-devkit/core';
import {
  chain,
  Rule,
  SchematicContext,
  Tree,
  mergeWith,
  apply,
  url,
  template,
  move
} from '@angular-devkit/schematics';
import {
  toFileName,
  names,
  offsetFromRoot,
  getNpmScope,
  updateJsonInTree,
  NxJson,
  updateWorkspaceInTree
} from '@nrwl/workspace';

import init from '../init/init';
import { Schema } from './schema';

interface NormalizedSchema extends Schema {
  projectName: string;
  appProjectRoot: Path;
  parsedTags: string[];
  fileName: string;
  workspaceName: string;
}

export default function(schema: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    const options = normalizeOptions(host, schema);

    return chain([
      init({ skipFormat: true }),
      createApplicationFiles(options),
      updateNxJson(options),
      addProject(options)
    ]);
  };
}

function createApplicationFiles(options: NormalizedSchema): Rule {
  return mergeWith(
    apply(url(`./files/app`), [
      template({
        ...names(options.name),
        ...options,
        tmpl: '',
        offsetFromRoot: offsetFromRoot(options.appProjectRoot),
        namespace: (appId: string) => appId.split('.').join('/')
      }),
      move(options.appProjectRoot)
    ])
  );
}

function updateNxJson(options: NormalizedSchema): Rule {
  return updateJsonInTree<NxJson>('nx.json', json => {
    json.projects[options.projectName] = { tags: options.parsedTags };
    return json;
  });
}

function addProject(options: NormalizedSchema): Rule {
  return updateWorkspaceInTree(json => {
    const architect: { [key: string]: any } = {};

    architect.build = {
      builder: '@jbuijgers/nx-react-native:build',
      options: {},
      configurations: {}
    };

    architect.serve = {
      builder: '@jbuijgers/nx-react-native:dev-server',
      options: {},
      configurations: {}
    };

    json.projects[options.projectName] = {
      root: options.appProjectRoot,
      sourceRoot: join(options.appProjectRoot, 'src'),
      projectType: 'application',
      schematics: {},
      architect
    };

    json.defaultProject = json.defaultProject || options.projectName;

    return json;
  });
}

function normalizeOptions(host: Tree, options: Schema): NormalizedSchema {
  const appDirectory = toFileName(options.name);
  const appProjectName = appDirectory.replace(new RegExp('/', 'g'), '-');
  const appProjectRoot = normalize(`apps/${appDirectory}`);
  const workspaceName = getNpmScope(host);

  const parsedTags = options.tags
    ? options.tags.split(',').map(s => s.trim())
    : [];

  return {
    ...options,
    name: toFileName(options.name),
    projectName: appProjectName,
    appProjectRoot,
    fileName: 'app',
    workspaceName,
    parsedTags
  };
}
