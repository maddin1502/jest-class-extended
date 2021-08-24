import { mock, mockDeep } from 'jest-mock-extended';
import type { Constructor, ConstructorInstance } from 'ts-lib-extended';
import type {
  DeepPartialConstructorParameters,
  JestClassDescribe,
  JestClassIt,
  JestClassItLabel,
  JestClassItOptions,
  DeepMockedConstructorParameters,
  JestClassDeepMock,
  MockedConstructorParameters
} from './types';

export class JestClassExtended<C extends Constructor> {
  constructor(
    private _constructor: C
  ) {}

  public readonly describe: JestClassDescribe = (...params_): void => this.classDescribe(describe, ...params_);
  public readonly fdescribe: JestClassDescribe = (...params_): void => this.classDescribe(fdescribe, ...params_);
  public readonly xdescribe: JestClassDescribe = (...params_): void => this.classDescribe(xdescribe, ...params_);

  private classDescribe(
    jestDescribe_: jest.Describe,
    callback_: jest.EmptyFunction,
    name_: string = this._constructor.name
  ): void {
    jestDescribe_(
      name_,
      () => {
        callback_();
      }
    );
  }

  public readonly it: JestClassIt<C> = (...params_): void => this.classIt(it,  ...params_);
  public readonly fit: JestClassIt<C> = (...params_): void => this.classIt(fit, ...params_);
  public readonly xit: JestClassIt<C> = (...params_): void => this.classIt(xit, ...params_);
  public readonly test: JestClassIt<C> = (...params_): void => this.classIt(test, ...params_);
  public readonly xtest: JestClassIt<C> = (...params_): void => this.classIt(xtest, ...params_);

  private classIt(
    jestIt_: jest.It,
    label_: JestClassItLabel<ConstructorInstance<C>>,
    assertions_: number,
    callback_: jest.ProvidesCallback,
    options_?: JestClassItOptions
  ): void {
    let assertionCallback: jest.ProvidesCallback;

    if (callback_.length === 0) {
      assertionCallback = async () => {
        expect.assertions(assertions_);
        await (callback_ as () => Promise<unknown>)();
      };
    } else {
      assertionCallback = done_ => {
        expect.assertions(assertions_);
        (callback_ as (cb: jest.DoneCallback) => void | undefined)(done_);
      };
    }

    jestIt_(
      this.classItName(label_),
      assertionCallback,
      options_?.timeout
    );
  }

  private classItName(label_: JestClassItLabel<ConstructorInstance<C>>): string {
    return Array.isArray(label_)
      ? label_.join(': ')
      : typeof label_ === 'object'
        ? label_.name
        : label_.toString();
  }

  public mock(...params_: DeepPartialConstructorParameters<C>): JestClassDeepMock<C> {
    const mockedParams = this.mockParams(...params_);
    return {
      params: mockedParams,
      instance: this.createInstance(mockedParams)
    };
  }

  private mockParams(...params_: DeepPartialConstructorParameters<C>): MockedConstructorParameters<C> {
    const params = params_.slice();

    while (params.length < this._constructor.length) {
      params.push(undefined);
    }

    return params.map(param_ => this.mockable(param_) ? mock(param_) : param_) as MockedConstructorParameters<C>;
  }

  public deepMock(...params_: DeepPartialConstructorParameters<C>): JestClassDeepMock<C> {
    const mockedParams = this.deepMockParams(...params_);
    return {
      params: mockedParams,
      instance: this.createInstance(mockedParams)
    };
  }

  private deepMockParams(...params_: DeepPartialConstructorParameters<C>): DeepMockedConstructorParameters<C> {
    const params = params_.slice();

    while (params.length < this._constructor.length) {
      params.push(undefined);
    }

    return params.map(param_ => this.mockable(param_) ? mockDeep(param_) : param_) as DeepMockedConstructorParameters<C>;
  }

  private mockable(value_: any): boolean {
    const valueType = typeof value_;
    return valueType === 'object' || valueType === 'function' || valueType === 'undefined';
  }

  private createInstance(mockedParams_: DeepMockedConstructorParameters<C>): ConstructorInstance<C> {
    return new this._constructor(...mockedParams_);
  }
}
