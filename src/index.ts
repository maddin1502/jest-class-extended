import type { Constructor } from 'ts-lib-extended';
import { JestClassExtended } from './extended';

export default <C extends Constructor>(constructor_: C): JestClassExtended<C> => new JestClassExtended(constructor_);

export type {
  ConstructorParametersMockImplementation,
  DeepMockConstructorParameters,
  JestClassDescribe,
  JestClassIt,
  JestClassItLabel,
  JestClassItOptions,
  JestClassMock,
  JestClassMockDeep,
  MockConstructorParameters
} from './types';
export { JestClassExtended };
