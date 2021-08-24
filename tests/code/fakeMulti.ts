export class FakeMultiMe {
  constructor(
    public one: string,
    public two: number,
    _obj_: { callme: () => string },
    public callme: () => string
  ) { }
}
