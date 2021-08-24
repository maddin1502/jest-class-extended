import { mockDeep } from 'jest-mock-extended';
import { Constructor, ConstructorInstance } from 'ts-lib-extended';
import { DeepPartialConstructorParameters, JestClassDescribe, JestClassIt, JestClassItLabel, JestClassItOptions, MockedConstructorParameters, TestSubject } from './types';

export class JestClassExtended<C extends Constructor<ConstructorInstance<C>>> {
  constructor(
    private _constructor: C
  ) {}

  public readonly describe: JestClassDescribe<C> = (...params_): void => this.classDescribe(describe, ...params_);
  public readonly fdescribe: JestClassDescribe<C> = (...params_): void => this.classDescribe(fdescribe, ...params_);
  public readonly xdescribe: JestClassDescribe<C> = (...params_): void => this.classDescribe(xdescribe, ...params_);

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

  public prepare(...params_: DeepPartialConstructorParameters<C>): TestSubject<C> {
    const mockedParams = this.createMockedParams(...params_);
    return {
      mocks: mockedParams,
      instance: this.createInstance(mockedParams)
    };
  }

  public create(...params_: DeepPartialConstructorParameters<C>): ConstructorInstance<C> {
    return this.createInstance(this.createMockedParams(...params_));
  }

  private createMockedParams(...params_: DeepPartialConstructorParameters<C>): MockedConstructorParameters<C> {
    const params = params_.slice();

    while (params.length < this._constructor.length) {
      params.push(undefined);
    }

    return params.map(param_ => mockDeep(param_)) as MockedConstructorParameters<C>;
  }

  private createInstance(mockedParams_: MockedConstructorParameters<C>): ConstructorInstance<C> {
    return new this._constructor(...mockedParams_);
  }
}
