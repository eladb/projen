import * as fs from 'fs-extra';
import { Component } from './component';
import { JsonFile } from './json';
import { NodeProject } from './node-project';
import { TaskCategory } from './tasks';

const VERSION_FILE = 'version.json';

export interface VersionOptions {
  /**
   * The name of the release branch where the code and tags are pushed to.
   */
  readonly releaseBranch: string;
}

export class Version extends Component {
  constructor(project: NodeProject, options: VersionOptions) {
    super(project);

    // this command determines if there were any changes since the last release
    // (the top-most commit is not a bump). it is used as a condition for both
    // the `bump` and the `release` tasks.
    const changesSinceLastRelease = '! git log --oneline -1 | grep -q "chore(release):"';

    const bump = project.addTask('bump', {
      description: 'Commits a bump to the package version based on conventional commits',
      category: TaskCategory.RELEASE,
      exec: 'standard-version',
      condition: changesSinceLastRelease,
    });

    const release = project.addTask('release', {
      description: `Bumps version & push to ${options.releaseBranch}`,
      category: TaskCategory.RELEASE,
      condition: changesSinceLastRelease,
    });

    release.subtask(bump);
    release.exec(`git push --follow-tags origin ${options.releaseBranch}`);

    project.addDevDeps(
      'standard-version@^9.0.0',
    );

    project.npmignore?.exclude('/.versionrc.json');
    project.gitignore.include(VERSION_FILE);

    new JsonFile(project, '.versionrc.json', {
      obj: {
        packageFiles: [{ filename: VERSION_FILE, type: 'json' }],
        bumpFiles: [{ filename: VERSION_FILE, type: 'json' }],
        commitAll: true,
        scripts: {
          // run projen after release to update package.json
          postbump: `${project.runScriptCommand} projen && git add .`,
        },
      },
    });
  }

  /**
   * Returns the current version of the project.
   */
  public resolveVersion(outdir: string) {
    const versionFile = `${outdir}/${VERSION_FILE}`;
    if (!fs.existsSync(versionFile)) {
      if (!fs.existsSync(outdir)) {
        fs.mkdirpSync(outdir);
      }
      fs.writeFileSync(versionFile, JSON.stringify({ version: '0.0.0' }));
    }

    return JSON.parse(fs.readFileSync(versionFile, 'utf-8')).version;
  }
}
