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

export function codeToSpec(file) {
  return file.replace(".js", ".test.js");
}

export function specToCode(file: string) {
  return file.replace(".test.js", ".js");
}
