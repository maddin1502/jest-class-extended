import type { DeepMockProxy, MockProxy } from 'jest-mock-extended';
import type { DeepPartial } from 'ts-essentials';
import type { Constructor, ConstructorInstance, ConstructorParameters } from 'ts-lib-extended';

export type JestClassItLabel<C extends Constructor> = keyof ConstructorInstance<C> | [ keyof ConstructorInstance<C>, string ] | { name: string };
export type DeepMockConstructorParameters<C extends Constructor> = DeepMockProxy<ConstructorParameters<C>>;
export type MockConstructorParameters<C extends Constructor> = MockProxy<ConstructorParameters<C>>;
export type ConstructorParametersMockImplementation<C extends Constructor> = DeepPartial<ConstructorParameters<C>>;
export type JestClassMockDeep<C extends Constructor> = {
  readonly params: DeepMockConstructorParameters<C>;
  readonly instance: ConstructorInstance<C>;
};
export type JestClassMock<C extends Constructor> = {
  readonly params: MockConstructorParameters<C>;
  readonly instance: ConstructorInstance<C>;
};
export type JestClassItOptions = {
  readonly timeout?: number;
};
export type JestClassIt<C extends Constructor> = (
  title_: JestClassItLabel<C>,
  assertions_: number,
  callback_: jest.ProvidesCallback,
  options_?: JestClassItOptions
) => void;
export type JestClassDescribe = (
  callback_: jest.EmptyFunction,
  name_?: string
) => void;
