import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as inquirer from 'inquirer';
import { PROJEN_RC } from '../common';
import * as logging from '../logging';
import { exec } from '../util';

const projenfile = path.resolve(PROJEN_RC);
const projen = path.join(__dirname, '..');
const gitFolder = path.resolve('.git');

export async function synth() {
  if (!fs.existsSync(projenfile)) {
    logging.error(`Unable to find ${projenfile}. Use "projen new" to create a new project.`);
    process.exit(1);
  }

  let pushInitialToGithub = false;

  if (!fs.existsSync(gitFolder)) {
    logging.info('We notice that you do not have a local git repository.');
    const { setUpGit } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'setUpGit',
        message: 'Do you want to set that up now?',
      },
    ]);

    if (setUpGit) {
      const { plan } = await inquirer.prompt(githubPlanOptions);

      const { gh, git } = plan;

      if (!git && !gh) {
        logging.info('Ok! Have a great day.');
      }

      if (git) {
        const { gitRepoURL } = await inquirer.prompt([
          {
            type: 'input',
            name: 'gitRepoURL',
            message: 'What is the repo? (example: https://github.com/projen/projen)',
          },
        ]);

        exec('git init');

        let formattedGitRepoURL = gitRepoURL;
        if (!gitRepoURL.includes('https')) {
          formattedGitRepoURL = `https://github/${gitRepoURL}`;
        }

        exec(`git remote add origin ${formattedGitRepoURL}`);

        logging.info(`Great! We've 'git init'd for you and set the remote to ${formattedGitRepoURL}`);
      }

      if (!git && gh) {
        logging.info('Ok! We will make you a repository on Github.');

        const { gitProjectName } = await inquirer.prompt([
          {
            type: 'input',
            name: 'gitProjectName',
            message: 'What would you like to name it?',
            default: path.basename(path.dirname(process.cwd())),
          },
        ]);

        logging.info(`Wow! ${gitProjectName} is such a great name!`);

        exec('git init');

        exec(`gh repo create ${gitProjectName}`);
        pushInitialToGithub = true;
      }
    }
  }

  // if node_modules/projen is not a directory or does not exist, create a
  // temporary symlink to the projen that we are currently running in order to
  // allow .projenrc.js to `require()` it.
  logging.info('Synthesizing project...');
  const projenModulePath = path.resolve('node_modules', 'projen');
  if (!fs.existsSync(path.join(projenModulePath, 'package.json')) || !fs.statSync(projenModulePath).isDirectory()) {
    fs.removeSync(projenModulePath);
    fs.mkdirpSync('node_modules');
    fs.symlinkSync(projen, projenModulePath, (os.platform() === 'win32') ? 'junction' : null);
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require(projenfile);

  if (pushInitialToGithub) {
    exec('git add .');
    exec('git commit -m \'Initial commit generated by projen\'');
    exec('git branch -M main');
    exec('git push --set-upstream origin main');
  }
}

const githubPlanOptions = [
  {
    type: 'list',
    name: 'plan',
    message: 'We\'ll need some more info. Please choose one:',
    choices: [
      {
        value: {
          git: true,
        },
        name: 'I already have a git repository',
      },
      {
        value: {
          gh: true,
          git: false,
        },
        name: 'I don\'t have a git repository and want to make one on Github',
      },
      {
        value: {
          gh: false,
          git: false,
        },
        name: 'I don\'t have a git repository and I don\'t want to use Github',
      },
    ],
  },
];