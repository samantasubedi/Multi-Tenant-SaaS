declare const Bun: {
  env: Record<string, string | undefined>;
  password: {
    hash: (value: string) => Promise<string>;
    verify: (plain: string, hash: string) => Promise<boolean>;
  };
};

declare const process: {
  env: Record<string, string | undefined>;
};
