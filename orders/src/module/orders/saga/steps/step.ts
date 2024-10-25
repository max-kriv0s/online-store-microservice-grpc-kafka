export abstract class Step<T, R> {
  name: string;
  abstract invoke(params: T): Promise<R>;
  abstract withCompenstion(params: T): Promise<R>;
}
