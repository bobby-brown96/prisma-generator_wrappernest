export function functionGeneratorGeneral(
    name: string,
    params: string,
    retType: string,
    body: string
): string {
    return ` ${name}(${params}): ${retType}{
       ${body}
     }
     `;
}

export function asyncFunctionGenerator(
    name: string,
    params: string,
    retType: string,
    body: string
): string {
    return ` async ${name}(${params}): Promise<${retType}>{
       ${body}
     }
     `;
}
