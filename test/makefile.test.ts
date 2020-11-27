import { Makefile } from '../src';
import { synthSnapshot, TestProject } from './util';

test('makefile synthesises correctly', () => {
  const prj = new TestProject();

  new Makefile(prj, 'Makefile', {
    all: ['one', 'two', 'three'],
    rules: [
      {
        targets: ['one'],
        recipe: ['touch one'],
        phony: false,
      },
      {
        targets: ['two', 'three'],
        prerequisites: ['one'],
        recipe: ['touch $@'],
      },
      {
        targets: ['clean'],
        recipe: ['rm -f one two three'],
        phony: true,
      },
    ],
  });

  expect(synthSnapshot(prj, true).Makefile).toStrictEqual([
    '.PHONY: all',
    'all: one two three',
    '',
    'one:',
    '\ttouch one',
    '',
    'two three: one',
    '\ttouch $@',
    '',
    '.PHONY: clean',
    'clean:',
    '\trm -f one two three',
    '', // new line at end of file
  ].join('\n'));
});

test('makefile synthesises correctly using imperative API', () => {
  const prj = new TestProject();

  new Makefile(prj, 'Makefile')
    .addRule({
      targets: ['one'],
      recipe: ['touch one'],
      phony: false,
    })
    .addRules(
      {
        targets: ['two', 'three'],
        prerequisites: ['one'],
        recipe: ['touch $@'],
      },
      {
        targets: ['clean'],
        recipe: ['rm -f one two three'],
        phony: true,
      },
    )
    .addAll('one')
    .addAlls('two', 'three');

  expect(synthSnapshot(prj, true).Makefile).toStrictEqual([
    '.PHONY: all',
    'all: one two three',
    '',
    'one:',
    '\ttouch one',
    '',
    'two three: one',
    '\ttouch $@',
    '',
    '.PHONY: clean',
    'clean:',
    '\trm -f one two three',
    '', // new line at end of file
  ].join('\n'));
});
