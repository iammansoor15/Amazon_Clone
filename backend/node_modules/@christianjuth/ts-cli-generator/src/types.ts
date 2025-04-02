type Reverse<Tuple> = Tuple extends [infer Head, ...infer Rest]
  ? [...Reverse<Rest>, Head]
  : [];

type PartialTurple<L extends any[]> = L extends [infer One]
  ? [One] | []
  : L extends [infer Head, ...infer Rest]
  ? [Head, ...Rest] | Rest
  : [];

export type ParamsPartial<T extends (...args: any) => any> =
  | Reverse<PartialTurple<Reverse<Parameters<T>>>>
  | [];

export type ParamsArrayPartial<T extends any[]> = PartialTurple<T> | [];

export type CLI = Record<string, (...args: any) => any>;

export type Events = {
  __onStart__: () => any;
  __version__: () => any;
  __help__: () => any;
  __beforeFn__: (fn: () => any) => any;
};
