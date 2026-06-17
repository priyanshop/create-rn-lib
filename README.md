# create-rn-lib

A CLI scaffolder that generates React / React Native library modules with a consistent, opinionated file structure — hooks, context, and provider — all wired up and ready to build on.

---

## Install

```bash
# Run directly without installing (recommended)
npx create-rn-lib create MyAuth

# Or install globally
npm install -g create-rn-lib
create-rn-lib create MyAuth
```

---

## Commands

### `create <name>` · alias `c`

Generates a new library module in a folder named after your library.

```bash
npx create-rn-lib create MyAuth
```

**Options:**

| Flag | Description | Default |
|------|-------------|---------|
| `-o, --out <dir>` | Output directory | current working directory |

```bash
# Generate inside a specific directory
npx create-rn-lib create MyPayment --out ./packages
```

---

### `preview <name>` · alias `p`

Dry-run — shows exactly what files will be created **without writing anything to disk**.

```bash
npx create-rn-lib preview MyAuth
```

---

## Generated Structure

Running `create-rn-lib create MyAuth` produces:

```
MyAuth/
└── src/
    ├── index.ts                        ← exports hooks + provider
    ├── hooks/
    │   ├── index.ts                    ← exports useMyAuth + useMyAuthContext
    │   ├── useMyAuth.ts                ← core hook (implement your logic here)
    │   └── useMyAuthContext.ts         ← consumes context, throws if used outside provider
    └── provider/
        ├── index.ts                    ← exports Provider + Context
        ├── MyAuthContext.ts            ← createContext with typed interface
        └── MyAuthProvider.tsx          ← wraps children with context value
```

---

## Name Formats Supported

The name argument accepts any casing — it is automatically converted to PascalCase:

| Input | Generated name |
|-------|---------------|
| `MyAuth` | `MyAuth` |
| `my-auth` | `MyAuth` |
| `my_auth` | `MyAuth` |
| `myauth` | `Myauth` |
| `my-payment-gateway` | `MyPaymentGateway` |

---

## Generated File Contents

### `src/index.ts`
```ts
export * from "./hooks";
export * from "./provider";
```

### `src/hooks/useMyAuth.ts`
```ts
import { MyAuthContextType } from '../provider/MyAuthContext';

export interface UseMyAuthProps {}

export const useMyAuth = (_: UseMyAuthProps): MyAuthContextType => {
  return {};
};
```

### `src/hooks/useMyAuthContext.ts`
```ts
import { useContext } from "react";
import MyAuthContext, { MyAuthContextType } from "../provider/MyAuthContext";

export const useMyAuthContext = (): MyAuthContextType => {
  const context = useContext(MyAuthContext);
  if (!context) {
    throw new Error(`useMyAuthContext must be used within a MyAuthProvider`);
  }
  return context;
};
```

### `src/provider/MyAuthContext.ts`
```ts
import { Context, createContext } from "react";

export interface MyAuthContextType {}

const MyAuthContext: Context<MyAuthContextType> =
  createContext<MyAuthContextType>({});

export default MyAuthContext;
```

### `src/provider/MyAuthProvider.tsx`
```tsx
import React from 'react';
import { useMyAuth } from '../hooks/useMyAuth';
import MyAuthContext from './MyAuthContext';

interface MyAuthProviderProps {
  methods: ReturnType<typeof useMyAuth>;
  children: React.ReactNode | React.ReactNode[];
}

export function MyAuthProvider({ methods, children }: MyAuthProviderProps) {
  return (
    <MyAuthContext.Provider value={methods}>{children}</MyAuthContext.Provider>
  );
}
```

---

## Publish to npm

```bash
npm run build
npm publish --access public
```

---

## License

MIT
