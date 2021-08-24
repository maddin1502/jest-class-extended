export class FakeDepMe {
  constructor(
    public _dep: { some: string, more: { stuff: any } },
    public _peeeep: { crazy: () => void }
  ) { }
}
