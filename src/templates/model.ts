import { IImport } from "../interfaces";
import { toNameCases } from "../utils/util";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function fieldGeneratorGeneral(
    name: any,
    type: any,
    decorator: string
): string {
    return `
    ${decorator}
    ${name}: ${type}`;
}

export function importGeneratorGeneral(options: IImport): string {
    const { NAME, MODULE } = options;
    return `import ${NAME} from "${MODULE}"`;
}

export function importGeneratorEnum(opts: string): string {
    return importGeneratorGeneral({
        NAME: `{${opts}}`,
        MODULE: `../enums/${opts}`
    });
}

export function importGeneratorModel(opts: string): string {
    const names = toNameCases(opts);
    return importGeneratorGeneral({
        NAME: `{${names.pascal}}`,
        MODULE: `../${names.camel}/${names.pascal}`
    });
}

export function classGenerator(
    name: string,
    body: string,
    decorator = ""
): string {
    return `${decorator}
    export class ${name} {
        ${body}
      }`;
}
