import { JestClassExtended } from '../../src/extended';
import { FakeMe } from './fake';
import { FakeDepMe } from './fakeDep';
import { FakeMultiMe } from './fakeMulti';

describe(JestClassExtended.name, () => {
  test('describe', () => {
    expect.assertions(4);
    const jce = new JestClassExtended(FakeMe);
    const jestDescribeMock = jest.spyOn(global, 'describe');
    const jestXDescribeMock = jest.spyOn(global, 'xdescribe');
    const jestFDescribeMock = jest.spyOn(global, 'fdescribe');

    jestDescribeMock.mockImplementation(({}, callback_) => { callback_(); });
    jestXDescribeMock.mockImplementation(({}, callback_) => { callback_(); });
    jestFDescribeMock.mockImplementation(({}, callback_) => { callback_(); });

    let called = 0;
    jce.describe(() => { called++; });
    jce.xdescribe(() => { called++; });
    jce.fdescribe(() => { called++; });

    expect(called).toBe(3);
    expect(jestDescribeMock).toBeCalledWith(FakeMe.name, expect.anything());
    expect(jestXDescribeMock).toBeCalledWith(FakeMe.name, expect.anything());
    expect(jestFDescribeMock).toBeCalledWith(FakeMe.name, expect.anything());
  });

  test('it', () => {
    expect.assertions(31);
    const jce = new JestClassExtended(FakeMe);
    const jestItMock = jest.spyOn(global, 'it');
    const jestFItMock = jest.spyOn(global, 'fit');
    const jestXItMock = jest.spyOn(global, 'xit');
    const jestTestMock = jest.spyOn(global, 'test');
    const jestXTestMock = jest.spyOn(global, 'xtest');
    const testCallbackMock = jest.fn();
    const doneMock: jest.DoneCallback = Object.assign(jest.fn(), {fail: jest.fn()});

    jestItMock.mockImplementation(({}, callback_) => { callback_?.(doneMock); });
    jestFItMock.mockImplementation(({}, callback_) => { callback_?.(doneMock); });
    jestXItMock.mockImplementation(({}, callback_) => { callback_?.(doneMock); });
    jestTestMock.mockImplementation(({}, callback_) => { callback_?.(doneMock); });
    jestXTestMock.mockImplementation(({}, callback_) => { callback_?.(doneMock); });

    const assertionsMock = jest.spyOn(expect, 'assertions');
    assertionsMock.mockImplementation();

    expect(testCallbackMock).not.toBeCalled();
    expect(assertionsMock).not.toBeCalled();
    expect(jestTestMock).not.toBeCalled();
    jce.test('doSomething', 3, testCallbackMock);
    expect(testCallbackMock).toBeCalledTimes(1);
    expect(assertionsMock).toBeCalledTimes(1);
    expect(jestTestMock).toBeCalledTimes(1);
    jce.test('something', 2, testCallbackMock, { timeout: 1000 });
    expect(testCallbackMock).toBeCalledTimes(2);
    expect(assertionsMock).toBeCalledTimes(2);
    expect(jestTestMock).toBeCalledTimes(2);
    jce.test({ name: 'otherthing' }, 1, testCallbackMock, {});
    expect(testCallbackMock).toBeCalledTimes(3);
    expect(assertionsMock).toBeCalledTimes(3);
    expect(jestTestMock).toBeCalledTimes(3);

    expect(jestTestMock).nthCalledWith(1, 'doSomething', expect.anything(), undefined);
    expect(jestTestMock).nthCalledWith(2, 'something', expect.anything(), 1000);
    expect(jestTestMock).nthCalledWith(3, 'otherthing', expect.anything(), undefined);

    expect(assertionsMock).nthCalledWith(1, 3);
    expect(assertionsMock).nthCalledWith(2, 2);
    expect(assertionsMock).nthCalledWith(3, 1);

    jce.it(['something', 'addition1'], 7, testCallbackMock);
    jce.xit(['something', 'addition2'], 6, testCallbackMock);
    jce.fit(['something', 'addition3'], 5, testCallbackMock);
    jce.xtest(['something', 'addition4'], 4, testCallbackMock);

    expect(testCallbackMock).toBeCalledTimes(7);
    expect(assertionsMock).toBeCalledTimes(7);

    expect(jestItMock).toBeCalledWith('something: addition1', expect.anything(), undefined);
    expect(jestXItMock).toBeCalledWith('something: addition2', expect.anything(), undefined);
    expect(jestFItMock).toBeCalledWith('something: addition3', expect.anything(), undefined);
    expect(jestXTestMock).toBeCalledWith('something: addition4', expect.anything(), undefined);

    expect(assertionsMock).nthCalledWith(4, 7);
    expect(assertionsMock).nthCalledWith(5, 6);
    expect(assertionsMock).nthCalledWith(6, 5);
    expect(assertionsMock).nthCalledWith(7, 4);

    expect(doneMock).not.toBeCalled();
    jce.test('doSomething', 8, done_ => { done_(); });
    expect(assertionsMock).nthCalledWith(8, 8);
    expect(doneMock).toBeCalled();
  });

  test('mockDeep', () => {
    expect.assertions(18);
    const jceFDM = new JestClassExtended(FakeDepMe);
    const preparedDepMe = jceFDM.mockDeep({ some: 'value'});
    expect(preparedDepMe.params.length).toBe(2);
    expect(preparedDepMe.params[0].some).toBe('value');
    expect(preparedDepMe.instance._dep.some).toBe('value');

    const jceFMM = new JestClassExtended(FakeMultiMe);
    const preparedMultiMe = jceFMM.mockDeep('nice', 42);
    expect(preparedMultiMe.params.length).toBe(4);
    expect(preparedMultiMe.params[0]).toBe('nice');
    expect(preparedMultiMe.params[1]).toBe(42);
    expect(preparedMultiMe.instance.one).toBe('nice');
    expect(preparedMultiMe.instance.two).toBe(42);

    const preparedMultiMe2 = jceFMM.mockDeep(undefined, 42, undefined, () => 'nonsense');
    expect(preparedMultiMe2.params.length).toBe(4);
    expect(preparedMultiMe2.params[0]).toBeDefined();
    expect(preparedMultiMe2.params[1]).toBe(42);
    expect(preparedMultiMe2.params[2]).toBeDefined();
    expect(preparedMultiMe2.params[3]()).toBe('nonsense');
    expect(preparedMultiMe2.instance.two).toBe(42);

    const instance = new JestClassExtended(FakeDepMe).mockDeep().instance;
    expect(instance._dep).toBeDefined();
    expect(instance._dep.some).toBeDefined();

    const instance2 = new JestClassExtended(FakeMultiMe).mockDeep().instance;
    expect(instance2.callme).toBeDefined();
    expect(instance2.one).toBeDefined();
  });

  test('mock', () => {
    expect.assertions(18);
    const jceFDM = new JestClassExtended(FakeDepMe);
    const preparedDepMe = jceFDM.mock({ some: 'value'});
    expect(preparedDepMe.params.length).toBe(2);
    expect(preparedDepMe.params[0].some).toBe('value');
    expect(preparedDepMe.instance._dep.some).toBe('value');

    const jceFMM = new JestClassExtended(FakeMultiMe);
    const preparedMultiMe = jceFMM.mock('nice', 42);
    expect(preparedMultiMe.params.length).toBe(4);
    expect(preparedMultiMe.params[0]).toBe('nice');
    expect(preparedMultiMe.params[1]).toBe(42);
    expect(preparedMultiMe.instance.one).toBe('nice');
    expect(preparedMultiMe.instance.two).toBe(42);

    const preparedMultiMe2 = jceFMM.mock(undefined, 42, undefined, () => 'nonsense');
    expect(preparedMultiMe2.params.length).toBe(4);
    expect(preparedMultiMe2.params[0]).toBeDefined();
    expect(preparedMultiMe2.params[1]).toBe(42);
    expect(preparedMultiMe2.params[2]).toBeDefined();
    expect(preparedMultiMe2.params[3]()).toBe('nonsense');
    expect(preparedMultiMe2.instance.two).toBe(42);

    const instance = new JestClassExtended(FakeDepMe).mock().instance;
    expect(instance._dep).toBeDefined();
    expect(instance._dep.some).toBeDefined();

    const instance2 = new JestClassExtended(FakeMultiMe).mock().instance;
    expect(instance2.callme).toBeDefined();
    expect(instance2.one).toBeDefined();
  });
});
