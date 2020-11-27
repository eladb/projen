import { NodeProject } from '../src';
import * as logging from '../src/logging';
import { mkdtemp, synthSnapshot } from './util';

logging.disable();

test('license file is added by default', () => {
  // WHEN
  const project = new NodeProject({
    outdir: mkdtemp(),
    name: 'test-node-project',
    start: false,
    mergify: false,
    projenDevDependency: false,
  });

  // THEN
  expect(synthSnapshot(project, false, 'LICENSE').LICENSE).toContain('Apache License');
});

test('license file is not added if licensed is false', () => {
  // WHEN
  const project = new NodeProject({
    outdir: mkdtemp(),
    name: 'test-node-project',
    licensed: false,
    start: false,
    mergify: false,
    projenDevDependency: false,
  });

  // THEN
  const snapshot = synthSnapshot(project, false, 'LICENSE', '.gitignore', 'package.json');
  expect(Object.keys(snapshot).sort()).toEqual(['.gitignore', 'package.json'].sort());
  expect(snapshot['.gitignore']).not.toContain('LICENSE');
  expect(snapshot['package.json'].license).toEqual('UNLICENSED');
});
