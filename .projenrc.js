const { JsiiProject, JsonFile, TextFile } = require('./lib');

const project = new JsiiProject({
  name: 'projen',
  description: 'A new generation of project generators',
  repository: 'https://github.com/projen/projen.git',
  authorName: 'Elad Ben-Israel',
  authorEmail: 'benisrae@amazon.com',
  stability: 'experimental',

  bundledDeps: [
    'yaml',
    'fs-extra',
    'yargs',
    'decamelize',
    'glob@^7',
    'semver',
    'inquirer',
    'chalk',
    '@iarna/toml',
  ],

  devDeps: [
    '@types/fs-extra@^8',
    '@types/yargs',
    '@types/glob',
    '@types/inquirer',
    '@types/semver',
    'markmac',
  ],

  projenDevDependency: false, // because I am projen
  releaseToNpm: true,
  minNodeVersion: '10.17.0',
  codeCov: true,
  compileBeforeTest: true, // since we want to run the cli in tests
  gitpod: true,
  devContainer: true,
  // since this is projen, we need to always compile before we run
  projenCommand: '/bin/bash ./projen.bash',

  readmeConfig: {
    summary: {
      lines: [
        'Define and maintain complex project configuration through code.',
        '',
        '> JOIN THE [#TemplatesAreEvil](https://twitter.com/hashtag/templatesareevil) MOVEMENT!',
        '',
        'projen synthesizes project configuration files such as `package.json`,',
        '`tsconfig.json`, `.gitignore`, GitHub Workflows, `eslint`, `jest`, etc from a',
        'well-typed definition written in `JavaScript`.',
        '',
        'Check out [this talk](https://www.youtube.com/watch?v=SOWMPzXtTCw&feature=youtu.be) about projen and the GitHub [Awesome List](https://github.com/p6m7g8/awesome-projen/blob/main/readme.md).',
        '',
        'As opposed to existing templating/scaffolding tools, projen is not a one-off',
        'generator. Synthesized files should never be manually edited (in fact, projen',
        'enforces that). To modify your project setup, users interact with rich',
        'strongly-typed class and execute projen to update their project configuration',
        'files.',
      ],
    },
    contributing: {
      lines: [
        'To check out a development environment:',
        '```console',
        '$ git clone git@github.com:projen/projen',
        '$ cd projen',
        '$ yarn',
        '```',
      ],
    },
    roadmap: {
      lines: [
        '> A non-exhaustive list of ideas/directions for projen',
        '',
        '- [ ] Multi-language support: ideally projenrc should be in the same language as your application code.',
        '- [ ] External components & projects: `projen new` should be able to list project types from registered 3rd party modules so we can grow the ecosystem easily.',
        '- [ ] Components: re-think/re-factor how components and projects interact to allow more modular and composable usage.',
        '- [ ] Discoverability of external components/modules through the CLI',
        '- [ ] Support projenrc in YAML (fully declarative, if one desires)',
        '- [ ] `projen SCRIPT`: make the CLI extensible so it can become _the_ project entrypoint (instead of e.g. `yarn`/`npm`, etc).',
        '- [ ] CLI bash & zsh completion',
      ],
    },
    usage: {
      lines: [
        'To create a new project, run the following command and follow the instructions:',
        '',
        '```console',
        '$ mkdir my-project',
        '$ cd my-project',
        '$ git init',
        '$ npx projen new PROJECT-TYPE',
        '🤖 Synthesizing project...',
        '...',
        '```',
        '',
        'Currently supported project types (use `npx projen new` without a type for a list):',
        '',
        '<!-- <macro exec="node ./scripts/readme-projects.js"> -->',
        '<!-- </macro> -->',
        '',
        '> Use `npx projen new PROJECT-TYPE --help` to view a list of command line',
        '> switches that allows you to specify most project options during bootstrapping.',
        '> For example: `npx projen new jsii --author-name "Jerry Berry"`.',
        '',
        'The `new` command will create a `.projenrc.js` file which looks like this for `jsii` projects:',
        '',
        '```',
        'const { JsiiProject } = require(\'projen\');',
        '',
        'const project = new JsiiProject({',
        '  authorAddress: "elad.benisrael@gmail.com",',
        '  authorName: "Elad Ben-Israel",',
        '  name: "foobar",',
        '  repository: "https://github.com/eladn/foobar.git",',
        '});',
        '',
        'project.synth();',
        '```',
        '',
        'This program instantiates the project type with minimal setup, and then calls',
        '`synth()` to synthesize the project files. By default, the `new` command will',
        'also execute this program, which will result in a fully working project.',
        '',
        'Once your project is created, you can configure your project by editing',
        '`.projenrc.js` and re-running `npx projen` to synthesize again.',
        '',
        '> The files generated by _projen_ are considered an "implementation detail" and',
        '> _projen_ protects them from being manually edited (most files are marked',
        '> read-only, and an "anti tamper" check is configured in the CI build workflow',
        '> to ensure that files are not updated during build).',
        '',
        'For example, to setup PyPI publishing in `jsii` projects, you can use',
        '[`python option`](https://github.com/projen/projen/blob/master/API.md#projen-jsiipythontarget):',
        '',
        '```js',
        'const project = new JsiiProject({',
        '  // ...',
        '  python: {',
        '    distName: "mydist",',
        '    module: "my_module",',
        '  }',
        '});',
        '```',
        '',
        'Run:',
        '',
        '```shell',
        'npx projen',
        '```',
        '',
        'And you\'ll notice that your `package.json` file now contains a `python` section in',
        'it\'s `jsii` config and the GitHub `release.yml` workflow includes a PyPI',
        'publishing step.',
        '',
        'We recommend to put this in your shell profile, so you can simply run `pj` every',
        'time you update `.projenrc.js`:',
        '',
        '```bash',
        'alias pj=\'npx projen\'',
        '```',
        '',
        'Most projects support a `start` command which displays a menu of workflow',
        'activities:',
        '',
        '```shell',
        '\$ yarn start',
        '? Scripts: (Use arrow keys)',
        '',
        '  BUILD',
        '❯ compile          Only compile',
        '  watch            Watch & compile in the background',
        '  build            Full release build (test+compile)',
        '',
        '  TEST',
        '  test             Run tests',
        '  test:watch       Run jest in watch mode',
        '  eslint           Runs eslint against the codebase',
        '',
        ' ...',
        '```',
        '',
        'The `build` command is the same command that\'s executed in your CI builds. It',
        'typically compiles, lints, tests and packages your module for distribution.',
        '',
        '## Features',
        '',
        'Some examples for features built-in to project types:',
        '',
        '* Fully synthesize `package.json`',
        '* Standard npm scripts like `compile`, `build`, `test`, `package`',
        '* eslint',
        '* Jest',
        '* jsii: compile, package, api compatibility checks, API.md',
        '* Bump & release scripts with CHANGELOG generation based on Conventional Commits',
        '* Automated PR builds',
        '* Automated releases to npm, maven, NuGet and PyPI',
        '* Mergify configuration',
        '* LICENSE file generation',
        '* gitignore + npmignore management',
        '* Node "engines" support with coupling to CI build environment and @types/node',
        '* Anti-tamper: CI builds will fail if a synthesized file is modified manually',
        '',
        '## API Reference',
        '',
        'See [API Reference](./API.md) for API details.',
        '',
        '## Ecosystem',
        '',
        '_projen_ takes a "batteries included" approach and aims to offer dozens of different project types out of',
        'the box (we are just getting started). Think `projen new react`, `projen new angular`, `projen new java-maven`,',
        '`projen new awscdk-typescript`, `projen new cdk8s-python` (nothing in projen is tied to javascript or npm!)...',
        '',
        'Adding new project types is as simple as submitting a pull request to this repo and exporting a class that',
        'extends `projen.Project` (or one of it\'s derivatives). Projen automatically discovers project types so your',
        'type will immediately be available in `projen new`.',
        '',
        '### Projects in external modules',
        '',
        '_projen_ is bundled with many project types out of the box, but it can also work',
        'with project types and components defined in external jsii modules (the reason',
        'we need jsii is because projen uses the jsii metadata to discover project types',
        '& options in projen new).',
        '',
        'Say we have a module in npm called `projen-vuejs` which includes a single project',
        'type for vue.js:',
        '',
        '```bash',
        '$ npx projen new --from projen-vuejs',
        '```',
        '',
        'If the referenced module includes multiple project types, the type is required.',
        'Switches can also be used to specify initial values based on the project type',
        'APIs. You can also use any package syntax supported by [yarn add](https://classic.yarnpkg.com/en/docs/cli/add#toc-adding-dependencies) like',
        '`projen-vuejs@1.2.3`, `file:/path/to/local/folder`,',
        '`git@github.com/awesome/projen-vuejs#1.2.3`, etc.',
        '',
        '```bash',
        '$ npx projen new --from projen-vuejs@^2 vuejs-ts --description "my awesome vue project"',
        '```',
        '',
        'Under the hood, `projen new` will install the `projen-vuejs` module from npm',
        '(version 2.0.0 and above), discover the project types in it and bootstrap the',
        '`vuejs-ts` project type. It will assign the value `"my awesome vue project"` to',
        'the `description` field. If you examine your `.projenrc.js` file, you\'ll see',
        'that `projen-vuejs` is defined as a dev dependency:',
        '',
        '```javascript',
        'const { VueJsProject } = require(\'projen-vuejs\');',
        '',
        'const project = new VueJsProject({',
        '  name: \'my-vuejs-sample\',',
        '  description: "my awesome vue project",',
        '  // ...',
        '  devDeps: [',
        '    \'projen-vuejs\'',
        '  ]',
        '});',
        '',
        'project.synth();',
        '```',
      ],
    },
  },
});

// this script is what we use as the projen command in this project
// it will compile the project if needed and then run the cli.
new TextFile(project, 'projen.bash', {
  lines: [
    '#!/bin/bash',
    `# ${TextFile.PROJEN_MARKER}`,
    'set -euo pipefail',
    'if [ ! -f lib/cli/index.js ]; then',
    '  echo "compiling the cli..."',
    `  ${project.compileTask.toShellCommand()}`,
    'fi',
    'exec bin/projen $@',
  ],
});

project.addExcludeFromCleanup('test/**');
project.gitignore.include('templates/**');

// // expand markdown macros in readme
// const macros = project.addTask('readme-macros');
// macros.exec('mv README.md README.md.bak');
// macros.exec('cat README.md.bak | markmac > README.md');
// macros.exec('rm README.md.bak');
// project.buildTask.spawn(macros);

new JsonFile(project, '.markdownlint.json', {
  obj: {
    'default': true,
    'commands-show-output': false,
    'line-length': {
      line_length: 200,
    },
  },
});

project.vscode.launchConfiguration.addConfiguration({
  type: 'pwa-node',
  request: 'launch',
  name: 'projen CLI',
  skipFiles: [
    '<node_internals>/**',
  ],
  program: '${workspaceFolder}/lib/cli/index.js',
  outFiles: [
    '${workspaceFolder}/lib/**/*.js',
  ],
});

project.github.addMergifyRules({
  name: 'Label core contributions',
  actions: {
    label: {
      add: ['contribution/core'],
    },
  },
  conditions: [
    'author~=^(eladb)$',
    'label!=contribution/core',
  ],
});

project.gitpod.addCustomTask({
  name: 'Setup',
  init: 'yarn install',
  prebuild: 'bash ./projen.bash',
  command: 'npx projen build',
});

const setup = project.addTask('devenv:setup');
setup.exec('yarn install');
setup.spawn(project.buildTask);
project.devContainer.addTasks(setup);

project.synth();
