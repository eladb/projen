import { NodePackage } from '../src';
import { synthSnapshot, TestProject } from './util';

test('minimal', () => {
  // GIVEN
  const project = new TestProject();

  // WHEN
  new NodePackage(project);

  // THEN
  expect(packageJson(project)).toStrictEqual({
    'name': 'my-project',
    'version': '0.0.0',
    'license': 'Apache-2.0',
    'main': 'lib/index.js',
    'bundledDependencies': [],
    'dependencies': {},
    'devDependencies': {},
    'peerDependencies': {},
    'scripts': {},
    '//': '~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".',
  });
});

test('packageName overrides project name', () => {
  const p = new TestProject();
  new NodePackage(p, { packageName: 'hoooray' });
  expect(packageJson(p).name).toStrictEqual('hoooray');
});

function packageJson(p: TestProject) {
  return synthSnapshot(p)['package.json'];
}