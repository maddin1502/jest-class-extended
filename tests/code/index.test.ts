import init, { JestClassExtended } from '../../src';
import { FakeMe } from './fake';

describe('root', () => {
  test('exports', () => {
    expect(init).toBeDefined();
    expect(JestClassExtended).toBeDefined();
    expect(init(FakeMe)).toBeDefined();
  });
});
