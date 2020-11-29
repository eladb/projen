import { Project } from '../src';
import { Task } from '../src/tasks';
import { TestProject, synthSnapshot } from './util';

test('empty task', () => {
  const p = new TestProject();

  // WHEN
  p.addTask('empty');

  // THEN
  expectManifest(p, {
    tasks: {
      empty: {
        name: 'empty',
      },
    },
  });
});

test('multiple "exec" commands', () => {
  const p = new TestProject();

  // WHEN
  const task = p.addTask('hello', {
    description: 'hello, world',
    exec: 'echo hello', // initial command
    env: {
      FOO: 'bar',
    },
  });

  task.exec('echo world');
  task.exec('echo "with quotes"');
  task.env('BAR', 'baz');

  // THEN
  expectManifest(p, {
    tasks: {
      hello: {
        name: 'hello',
        description: 'hello, world',
        env: {
          FOO: 'bar',
          BAR: 'baz',
        },
        steps: [
          { exec: 'echo hello' },
          { exec: 'echo world' },
          { exec: 'echo "with quotes"' },
        ],
      },
    },
  });
});

test('subtasks', () => {
  // GIVEN
  const p = new TestProject();
  const hello = p.addTask('hello', { exec: 'echo hello' });
  const world = p.addTask('world');

  // WHEN
  world.exec('echo "running hello"');
  world.subtask(hello);

  // THEN
  expectManifest(p, {
    tasks: {
      hello: {
        name: 'hello',
        steps: [{ exec: 'echo hello' }],
      },
      world: {
        name: 'world',
        steps: [
          { exec: 'echo "running hello"' },
          { subtask: 'hello' },
        ],
      },
    },
  });
});

function expectManifest(p: Project, toStrictEqual: any) {
  const manifest = synthSnapshot(p)[Task.MANIFEST_FILE];
  delete manifest['//'];

  expect(manifest).toStrictEqual(toStrictEqual);
}