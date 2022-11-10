import { toNameCases } from "../utils/util";
import { importGeneratorGeneral } from "./model";

export function createDtoGenerator(
    name: string,
    body: string,
    decorator = ""
): string {
    return `${decorator}
    export class Create${name}DtoBase {
        ${body}
      }`;
}

export function importGeneratorEnumDto(opts: string): string {
    return importGeneratorGeneral({
        NAME: `{${opts}}`,
        MODULE: `../../enums/${opts}`
    });
}

export function importGeneratorCreateDto(opts: string): string {
    const names = toNameCases(opts);
    return importGeneratorGeneral({
        NAME: `{Create${names.pascal}DtoBase}`,
        MODULE: `../../${names.camel}/dtos/Create-${names.pascal}.dto`
    });
}
