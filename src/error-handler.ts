/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Dictionary } from "@prisma/internals";
import { logger } from "@prisma/sdk";
import { PrismaNestBaseGeneratorOptions } from "./generator";

export class GeneratorFormatNotValidError extends Error {
    config: Dictionary<string>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(config: any) {
        super();
        this.config = config;
    }
}

export class GeneratorPathNotExists extends Error {}

export const handleGenerateError = (e: Error): void => {
    if (e instanceof GeneratorFormatNotValidError) {
        const options = Object.keys(PrismaNestBaseGeneratorOptions).map(
            (key) => {
                //@ts-ignore
                const value = PrismaNestBaseGeneratorOptions[key];
                return `\t${key} = (${value.defaultValue}) <- [${value.desc}]`;
            }
        );
        logger.info(
            [
                "\nUsage : ",
                "generator prismaClassGenerator {",
                '\tprovider = "prisma-class-generator"',
                "\toutput = (string)",
                ...options,
                "}"
            ].join("\n")
        );
        logger.info(`Your Input : ${JSON.stringify(e.config)}`);
        return;
    }
    if (e instanceof GeneratorPathNotExists) {
        logger.error("path not valid in generator");
        return;
    }
    console.log("unexpected error occurred");
    console.log(e);
};
