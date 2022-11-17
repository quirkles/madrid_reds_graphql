export abstract class AlternateResponse {
  protected __typeName: string;

  protected constructor(typename: string) {
    this.__typeName = typename;
  }

  get __typename(): string {
    return this.__typeName;
  }
}
