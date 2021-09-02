# jest-class-extended
> Type safe jest extension for class based code with auto parameter mocking.

[![npm version](https://badge.fury.io/js/jest-class-extended.svg)](https://badge.fury.io/js/jest-class-extended)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm downloads](https://badgen.net/npm/dw/jest-class-extended)](https://badge.fury.io/js/jest-class-extended)

## Features
- automock constructor parameters using [jest-mock-extended](https://www.npmjs.com/package/jest-mock-extended)
  - resolve dependencies on incoming parameters
  - limit tests to this one specific class
- class based "describe" and "test" methods based on [jest](https://www.npmjs.com/package/jest)
  - unified describe-naming
  - unified test-naming
- forced expected assertions to ensure test execution
- fully "mergable" with default jest features

## Installation
```bash
npm i jest-class-extended --save-dev
```
or
```bash
yarn add jest-class-extended --dev
```

## Usage

```ts
import jce, { JestClassExtended } from 'jest-class-extended';

// a dependency of example class
class Dependency {
  private _data: string;

  constructor(data_: string) {
    this._data = data_;
  }

  public getData(): string {
    return this._data;
  }

  public async isValid(): Promise<boolean> {
    return await Promise.resolve(/* do unknown stuff*/true);
  }
}

// class that should be tested
class Example {
  private _value: number;
  private _dependency: Dependency;

  constructor(value_: number, dependency_: Dependency) {
    this._value = value_;
    this._dependency = dependency_;
  }

  public get value(): number { return this._value; }
  public get data(): string { return this._dependency.getData(); }

  public async validateSomething(): Promise<void> {
    const isValid = await this._dependency.isValid();
    if (!isValid) {
      throw new Error('something went wrong');
    }
  }
}

const jestClass = jce(Example);
// or
// const jestClass = new JestClassExtended(Example);

// describe will use class.name as name; set the optional 'name_' parameter to override
jestClass.describe(() => {
  jestClass.test(
    // test-names are based on public members of the class; use { name: 'any name' } to set a custom name
    'value',
    1,
    () => {
      // use a specific value '42' as constructor argument
      const instance = jestClass.mock(42).instance;
      expect(instance.value).toBe(42);
    }
  );

  jestClass.test(
    'data',
    1,
    () => {
      // use mockDeep to automock deep members like 'getData' of 'Dependency'
      const classMockDeep = jestClass.mockDeep();
      // use 'params' to modify mocked values -> mock return value of 'getData'
      // params array is based on constructor arguments (same order, same type but extended for mocking)
      classMockDeep.params[1].getData.mockReturnValue('hello world');
      expect(classMockDeep.instance.data).toBe('hello world');
    }
  );

  jestClass.test(
    // you can extend the test name by using an array; this first item has to be a class member name -> jest will output "validateSomething: success"
    ['validateSomething', 'success'],
    1,
    // async code is supported, too
    async (): Promise<void> => {
      const classMockDeep = jestClass.mockDeep();
      // mock the return value of the Promise
      classMockDeep.params[1].isValid.mockResolvedValue(true);
      await expect(classMockDeep.instance.validateSomething()).resolves.not.toThrow();
    }
  );

  jestClass.test(
    ['validateSomething', 'failure'],
    1,
    async (): Promise<void> => {
      const classMockDeep = jestClass.mockDeep();
      // force error by simulating 'false'
      classMockDeep.params[1].isValid.mockResolvedValue(false);
      await expect(classMockDeep.instance.validateSomething()).rejects.toThrow('something went wrong');
    }
  );
});
```
