export function getRelated(file) {
  if (isSpec(file)) {
    return specToCode(file);
  } else {
    return codeToSpec(file);
  }
}

export function isSpec(file) {
  return file.indexOf(".spec") > -1 || file.indexOf(".test") > -1;
}

export function codeToSpec(file: string) {
  if (file.includes(".js")) return file.replace(".js", ".test.js");
  if (file.includes(".ts")) return file.replace(".ts", ".test.ts");
}

export function specToCode(file: string) {
  if (file.includes(".js")) return file.replace(".test.js", ".js");
  if (file.includes(".ts")) return file.replace(".test.ts", ".ts");
}
