import { messages } from './messages';

const getOrSetDescendantProp = (
  obj: object,
  is: string | string[],
  value = undefined,
): unknown => {
  if (typeof is == 'string') {
    return getOrSetDescendantProp(obj, is.split('.'), value);
  } else if (is.length == 1 && value !== undefined) {
    const key = is[0] as keyof object;
    return (obj[key] = value);
  } else if (is.length == 0) {
    return obj;
  } else {
    const key = is[0] as keyof object;
    return getOrSetDescendantProp(obj[key], is.slice(1), value);
  }
};

type FlattenObjectKeys<
  T extends Record<string, unknown>,
  Key = keyof T,
> = Key extends string
  ? T[Key] extends Record<string, unknown>
    ? `${Key}.${FlattenObjectKeys<T[Key]>}`
    : `${Key}`
  : never;

type FlatKeys = FlattenObjectKeys<typeof messages>;

const getMessage = (flatKey: FlatKeys): string | object => {
  const valueMessage = getOrSetDescendantProp(messages, flatKey);
  return valueMessage ?? '';
};

export { getMessage };
