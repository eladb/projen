import { join, dirname } from 'path';
import { copySync } from 'fs-extra';
import { glob } from 'glob';
import { exec } from '../src/util';
import { mkdtemp, directorySnapshot } from './util';

const cli = require.resolve('../lib/cli');
const samples = join(__dirname, 'integration');
const files = glob.sync('*.projenrc.js', { cwd: samples });

for (const projenrc of files) {
  test(projenrc, () => {
    const workdir = mkdtemp();
    const base = join(samples, dirname(projenrc));
    copySync(base, workdir, { recursive: true });
    copySync(join(base, projenrc), join(workdir, '.projenrc.js'));
    const command = [
      process.execPath,
      cli,
      '--no-post',
    ];
    exec(command.join(' '), { cwd: workdir });
    expect(directorySnapshot(workdir, { excludeGlobs: ['node_modules/**'] })).toMatchSnapshot();
  });
}
