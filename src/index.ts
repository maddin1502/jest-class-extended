import type { Constructor } from 'ts-lib-extended';
import { JestClassExtended } from './extended';

export default <C extends Constructor>(constructor_: C): JestClassExtended<C> => new JestClassExtended(constructor_);

export * from './types';
export { JestClassExtended };
