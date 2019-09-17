export class Resolver {
  constructor(private suffix: string) {
    console.log(suffix)
  }

  public getRelated(file) {
    if (this.isSpec(file)) {
      return this.specToCode(file);
    } else {
      return this.codeToSpec(file);
    }
  }

  private isSpec(file) {
    return file.indexOf(`.${this.suffix}`) > -1;
  }

  private codeToSpec(file: string) {
    if (file.includes(".js")) return file.replace(".js", `.${this.suffix}.js`);
    if (file.includes(".ts")) return file.replace(".ts", `.${this.suffix}.ts`);
  }

  private specToCode(file: string) {
    if (file.includes(".js")) return file.replace(`.${this.suffix}.js`, ".js");
    if (file.includes(".ts")) return file.replace(`.${this.suffix}.ts`, ".ts");
  }
}