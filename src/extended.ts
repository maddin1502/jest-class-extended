import { mockDeep } from 'jest-mock-extended';
import { Constructor, ConstructorInstance } from 'ts-lib-extended';
import { DeepPartialConstructorParameters, MockedConstructorParameters, TestLabel, TestSubject } from './types';

interface CheckOptionsInterface {
  readonly timeout?: number;
}

export class JestClassExtended<C extends Constructor<ConstructorInstance<C>>> {
  constructor(
    private _constructor: C
  ) {}

  public describe(callback_: jest.EmptyFunction): void {
    describe(this._constructor.name, () => {
      callback_();
    });
  }

  public test(
    title_: TestLabel<ConstructorInstance<C>>,
    expectedAssertions_: number,
    callback_: jest.ProvidesCallback,
    options_?: CheckOptionsInterface
  ): void {
    let assertionCallback: jest.ProvidesCallback;

    if (callback_.length === 0) {
      assertionCallback = async () => {
        expect.assertions(expectedAssertions_);
        await (callback_ as () => Promise<unknown>)();
      };
    } else {
      assertionCallback = done_ => {
        expect.assertions(expectedAssertions_);
        (callback_ as (cb: jest.DoneCallback) => void | undefined)(done_);
      };
    }

    test(
      Array.isArray(title_)
        ? title_.join(': ')
        : typeof title_ === 'object'
          ? title_.custom
          : title_.toString(),
      assertionCallback,
      options_?.timeout
    );
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
