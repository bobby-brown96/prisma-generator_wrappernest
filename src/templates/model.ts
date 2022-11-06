import { IImport } from "../interfaces";

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
    return importGeneratorGeneral({
        NAME: `{${opts}}`,
        MODULE: `./${opts}`
    });
}
