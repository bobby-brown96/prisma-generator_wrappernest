export function createDtoGenerator(
    name: string,
    body: string,
    decorator = ""
): string {
    return `${decorator}
    export class Create${name}Dto {
        ${body}
      }`;
}
