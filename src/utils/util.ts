import * as changeCase from "change-case";
import { INameCases } from "../interfaces/INameCases";

export const convertBool = (opts: boolean): boolean => {
    return opts === false ? false : true;
};

export const toNameCases = (opts: string): INameCases => {
    return {
        camel: changeCase.camelCase(opts),
        snake: changeCase.snakeCase(opts),
        pascal: changeCase.pascalCase(opts),
        caps: changeCase.constantCase(opts),
        title: changeCase.capitalCase(opts, { delimiter: "" })
    };
};
