import { Dependabot } from '../..';
import { TestProject } from '../util';

test('throws if auto approve and project isnt configured with auto approval workflow', () => {

  const project = new TestProject();

  expect(() => {
    new Dependabot(project.github!, { autoApprove: true });
  }).toThrowError('Project must have auto-approve configured in order to auto-approve dependabot PRs');
});

test('auto approve defaults to true when secret is defined', () => {
  const project = new TestProject({ projenSecret: 'PROJEN_SECRET' });
  const dependabot = new Dependabot(project.github!);

  expect(dependabot.config.updates[0].default_labels).toEqual([project.autoApprove?.label]);
});

test('auto approve can be disabled', () => {
  const project = new TestProject({ projenSecret: 'PROJEN_SECRET' });
  const dependabot = new Dependabot(project.github!, { autoApprove: false });

  expect(dependabot.config.updates[0].default_labels).toEqual([]);
});