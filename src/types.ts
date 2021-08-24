import { DeepMockProxy } from 'jest-mock-extended/lib/Mock';
import { DeepPartial } from 'ts-essentials';
import { Constructor, ConstructorInstance, ConstructorParameters } from 'ts-lib-extended';

export type TestLabel<T> = keyof T | [ keyof T, string ] | { custom: string };

export type MockedConstructorParameters<C extends Constructor>
  = DeepMockProxy<ConstructorParameters<C>> & ConstructorParameters<C>;

export type DeepPartialConstructorParameters<C extends Constructor<ConstructorInstance<C>>>
  = DeepPartial<ConstructorParameters<C>>;

export type TestSubject<C extends Constructor<ConstructorInstance<C>>> = {
  readonly mocks: MockedConstructorParameters<C>,
  readonly instance: ConstructorInstance<C>
};
