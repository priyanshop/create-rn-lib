import fs from "fs";
import path from "path";
import {
  srcIndexTemplate,
  hooksIndexTemplate,
  useLibTemplate,
  useLibContextTemplate,
  providerIndexTemplate,
  libContextTemplate,
  libProviderTemplate,
} from "./templates";

export interface GenerateOptions {
  name: string;       // PascalCase library name, e.g. "MyAuth"
  outDir: string;     // absolute path to parent directory
}

export interface GeneratedFile {
  relativePath: string;
  content: string;
}

/** Converts any string to PascalCase */
export function toPascalCase(input: string): string {
  return input
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^(.)/, (c) => c.toUpperCase());
}

/** Returns the full list of files to be generated */
export function buildFileList(name: string): GeneratedFile[] {
  return [
    // src/index.ts
    {
      relativePath: "src/index.ts",
      content: srcIndexTemplate(name),
    },
    // src/hooks/index.ts
    {
      relativePath: "src/hooks/index.ts",
      content: hooksIndexTemplate(name),
    },
    // src/hooks/use<Name>.ts
    {
      relativePath: `src/hooks/use${name}.ts`,
      content: useLibTemplate(name),
    },
    // src/hooks/use<Name>Context.ts
    {
      relativePath: `src/hooks/use${name}Context.ts`,
      content: useLibContextTemplate(name),
    },
    // src/provider/index.ts
    {
      relativePath: "src/provider/index.ts",
      content: providerIndexTemplate(name),
    },
    // src/provider/<Name>Context.ts
    {
      relativePath: `src/provider/${name}Context.ts`,
      content: libContextTemplate(name),
    },
    // src/provider/<Name>Provider.tsx
    {
      relativePath: `src/provider/${name}Provider.tsx`,
      content: libProviderTemplate(name),
    },
  ];
}

/** Writes all files to disk */
export function generateLibrary(options: GenerateOptions): GeneratedFile[] {
  const { name, outDir } = options;
  const pascalName = toPascalCase(name);
  const rootDir = path.join(outDir, pascalName);

  if (fs.existsSync(rootDir)) {
    throw new Error(
      `Directory "${pascalName}" already exists at ${outDir}. Aborting to avoid overwrite.`
    );
  }

  const files = buildFileList(pascalName);

  for (const file of files) {
    const fullPath = path.join(rootDir, file.relativePath);
    const dir = path.dirname(fullPath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, file.content, "utf8");
  }

  return files.map((f) => ({
    ...f,
    relativePath: path.join(pascalName, f.relativePath),
  }));
}
