declare module 'bun:test' {
  export type TestFn = () => void | Promise<void>;

  export function describe(name: string, fn: TestFn): void;
  export function it(name: string, fn: TestFn): void;
  export function test(name: string, fn: TestFn): void;
  export function beforeAll(fn: TestFn): void;
  export function beforeEach(fn: TestFn): void;
  export function afterAll(fn: TestFn): void;
  export function afterEach(fn: TestFn): void;

  export function expect<T>(actual: T): {
    toBe(expected: T): void;
    toEqual(expected: unknown): void;
    toContain(expected: unknown): void;
    toStrictEqual(expected: unknown): void;
  };
}
