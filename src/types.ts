import { DeepMockProxy } from 'jest-mock-extended/lib/Mock';
import { DeepPartial } from 'ts-essentials';
import { Constructor, ConstructorInstance, ConstructorParameters } from 'ts-lib-extended';

export type JestClassItLabel<T> = keyof T | [ keyof T, string ] | { name: string };

export type MockedConstructorParameters<C extends Constructor<ConstructorInstance<C>>>
  = DeepMockProxy<ConstructorParameters<C>> & ConstructorParameters<C>;

export type DeepPartialConstructorParameters<C extends Constructor<ConstructorInstance<C>>>
  = DeepPartial<ConstructorParameters<C>>;

export type TestSubject<C extends Constructor<ConstructorInstance<C>>> = {
  readonly mocks: MockedConstructorParameters<C>,
  readonly instance: ConstructorInstance<C>
};

export type JestClassItOptions = {
  readonly timeout?: number;
}

export type JestClassIt<C extends Constructor<ConstructorInstance<C>>> = (
  title_: JestClassItLabel<ConstructorInstance<C>>,
  assertions_: number,
  callback_: jest.ProvidesCallback,
  options_?: JestClassItOptions
) => void;

export  type JestClassDescribe<C extends Constructor<ConstructorInstance<C>>> = (
  callback_: jest.EmptyFunction,
  name_?: string
) => void;
