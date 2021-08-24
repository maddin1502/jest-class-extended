import { mock } from 'jest-mock-extended';
import { JestClassExtended } from '../../src/extended';
import { FakeMe } from './fake';

describe(JestClassExtended.name, () => {
  test('describe', () => {
    expect.assertions(3);
    const jce = new JestClassExtended(FakeMe);
    const jestDescribeMock = jest.spyOn(global, 'describe');

    jestDescribeMock.mockImplementation(
      ({}, callback_) => {
        // simulate invoking callback by jest
        callback_();
      }
    );

    expect(jestDescribeMock).not.toBeCalled();
    let called = false;
    jce.describe(() => { called = true; });
    expect(called).toBe(true);
    expect(jestDescribeMock).toBeCalledWith(FakeMe.name, expect.anything());
  });

  test('test', () => {
    expect.assertions(18);
    const jce = new JestClassExtended(FakeMe);
    const jestTestMock = jest.spyOn(global, 'test');
    const testCallbackMock = jest.fn();

    jestTestMock.mockImplementation(
      ({}, callback_) => {
        // simulate invoking callback by jest
        callback_?.(mock<jest.DoneCallback>());
      }
    );

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
    jce.test({ custom: 'otherthing' }, 1, testCallbackMock, {});
    expect(testCallbackMock).toBeCalledTimes(3);
    expect(assertionsMock).toBeCalledTimes(3);
    expect(jestTestMock).toBeCalledTimes(3);

    expect(jestTestMock).nthCalledWith(1, 'doSomething', expect.anything(), undefined);
    expect(jestTestMock).nthCalledWith(2, 'something', expect.anything(), 1000);
    expect(jestTestMock).nthCalledWith(3, 'otherthing', expect.anything(), undefined);

    expect(assertionsMock).nthCalledWith(1, 3);
    expect(assertionsMock).nthCalledWith(2, 2);
    expect(assertionsMock).nthCalledWith(3, 1);
  });

  // test('prepare', () => {
  //   expect.assertions(14);
  //   const cfw = createClassTestFramework();
  //   const preparedDepMe = cfw.prepare(FakeDepMe, { some: 'value'});
  //   expect(preparedDepMe.mocks.length).toBe(2);
  //   expect(preparedDepMe.mocks[0].some).toBe('value');
  //   expect(preparedDepMe.instance._dep.some).toBe('value');

  //   const preparedMultiMe = cfw.prepare(FakeMultiMe, 'nice', 42);
  //   expect(preparedMultiMe.mocks.length).toBe(4);
  //   expect(preparedMultiMe.mocks[0]).toBe('nice');
  //   expect(preparedMultiMe.mocks[1]).toBe(42);
  //   expect(preparedMultiMe.instance.one).toBe('nice');
  //   expect(preparedMultiMe.instance.two).toBe(42);

  //   const preparedMultiMe2 = cfw.prepare(FakeMultiMe, undefined, 42, undefined, () => 'nonsense');
  //   expect(preparedMultiMe2.mocks.length).toBe(4);
  //   expect(preparedMultiMe2.mocks[0]).toBeDefined();
  //   expect(preparedMultiMe2.mocks[1]).toBe(42);
  //   expect(preparedMultiMe2.mocks[2]).toBeDefined();
  //   expect(preparedMultiMe2.mocks[3]()).toBe('nonsense');
  //   expect(preparedMultiMe2.instance.two).toBe(42);
  // });

  // test('create', () => {
  //   expect.assertions(4);
  //   const cfw = createClassTestFramework();
  //   const instance = cfw.create(FakeDepMe);
  //   expect(instance._dep).toBeDefined();
  //   expect(instance._dep.some).toBeDefined();

  //   const instance2 = cfw.create(FakeMultiMe);
  //   expect(instance2.callme).toBeDefined();
  //   expect(instance2.one).toBeDefined();
  // });
});
