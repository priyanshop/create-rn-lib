// ─── templates/index.ts ──────────────────────────────────────────────────────
// All file templates. Each function receives the PascalCase lib name and
// returns the file content as a string.

export function srcIndexTemplate(name: string): string {
  return `export * from "./hooks";
export * from "./provider";
`;
}

export function hooksIndexTemplate(name: string): string {
  return `export * from "./use${name}";
export * from "./use${name}Context";
`;
}

export function useLibTemplate(name: string): string {
  return `import { ${name}ContextType } from '../provider/${name}Context';

export interface Use${name}Props {}

export const use${name} = (_: Use${name}Props): ${name}ContextType => {
  return {};
};
`;
}

export function useLibContextTemplate(name: string): string {
  return `import { useContext } from "react";
import ${name}Context, {
  ${name}ContextType,
} from "../provider/${name}Context";

export const use${name}Context = (): ${name}ContextType => {
  const context = useContext(${name}Context);

  if (!context) {
    throw new Error(\`use${name}Context must be used within a ${name}Provider\`);
  }
  return context;
};
`;
}

export function providerIndexTemplate(name: string): string {
  return `export * from './${name}Provider';
export * from './${name}Context';
`;
}

export function libContextTemplate(name: string): string {
  return `import { Context, createContext } from "react";

export interface ${name}ContextType {}

const ${name}Context: Context<${name}ContextType> =
  createContext<${name}ContextType>({});

export default ${name}Context;
`;
}

export function libProviderTemplate(name: string): string {
  return `import React from 'react';
import { use${name} } from '../hooks/use${name}';
import ${name}Context from './${name}Context';

interface ${name}ProviderProps {
  methods: ReturnType<typeof use${name}>;
  children: React.ReactNode | React.ReactNode[];
}

export function ${name}Provider({
  methods,
  children,
}: ${name}ProviderProps): React.ReactElement<${name}ProviderProps> {
  return (
    <${name}Context.Provider value={methods}>{children}</${name}Context.Provider>
  );
}
`;
}
