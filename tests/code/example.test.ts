import jce from '../../src';

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

jestClass.describe(() => {
  jestClass.test(
    'value',
    1,
    () => {
      const instance = jestClass.mock(42).instance;
      expect(instance.value).toBe(42);
    }
  );

  jestClass.test(
    'data',
    1,
    () => {
      const classMockDeep = jestClass.mockDeep();
      classMockDeep.params[1].getData.mockReturnValue('hello world');
      expect(classMockDeep.instance.data).toBe('hello world');
    }
  );

  jestClass.test(
    ['validateSomething', 'success'],
    1,
    async (): Promise<void> => {
      const classMockDeep = jestClass.mockDeep();
      classMockDeep.params[1].isValid.mockResolvedValue(true);
      await expect(classMockDeep.instance.validateSomething()).resolves.not.toThrow();
    }
  );

  jestClass.test(
    ['validateSomething', 'failure'],
    1,
    async (): Promise<void> => {
      const classMockDeep = jestClass.mockDeep();
      classMockDeep.params[1].isValid.mockResolvedValue(false);
      await expect(classMockDeep.instance.validateSomething()).rejects.toThrow('something went wrong');
    }
  );
});
