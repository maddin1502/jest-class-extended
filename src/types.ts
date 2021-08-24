import { DeepMockProxy } from 'jest-mock-extended/lib/Mock';
import { DeepPartial } from 'ts-essentials';
import { Constructor, ConstructorInstance, ConstructorParameters } from 'ts-lib-extended';

export type JestClassItLabel<C extends Constructor> = keyof ConstructorInstance<C> | [ keyof ConstructorInstance<C>, string ] | { name: string };

export type MockedConstructorParameters<C extends Constructor>
  = DeepMockProxy<ConstructorParameters<C>> & ConstructorParameters<C>;

export type DeepPartialConstructorParameters<C extends Constructor>
  = DeepPartial<ConstructorParameters<C>>;

export type TestSubject<C extends Constructor> = {
  readonly mocks: MockedConstructorParameters<C>,
  readonly instance: ConstructorInstance<C>
};

export type JestClassItOptions = {
  readonly timeout?: number;
}

export type JestClassIt<C extends Constructor> = (
  title_: JestClassItLabel<C>,
  assertions_: number,
  callback_: jest.ProvidesCallback,
  options_?: JestClassItOptions
) => void;

export  type JestClassDescribe = (
  callback_: jest.EmptyFunction,
  name_?: string
) => void;
