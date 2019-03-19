import test from 'ava'

import { trim } from '../src/util'

test('Trimming a string', t => {
  t.is(trim('/hey', '/'), 'hey')

  t.is(trim('hey/', '/'), 'hey')

  t.is(trim('//hey//', '/'), 'hey')

  t.is(trim('///e//', '///'), 'e//')

  t.is(trim('//hey//', '\\'), '//hey//')

  t.is(trim('//h//ey//', '/'), 'h//ey')

  t.is(trim('hey', '/'), 'hey')

  t.is(trim('hey', '////'), 'hey')

  t.is(trim('//////', '///'), '')

  t.is(trim('///////', '///'), '/')

  t.is(trim('//', '////'), '//')
})
