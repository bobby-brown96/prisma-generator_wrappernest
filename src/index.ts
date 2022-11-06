/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { generatorHandler, GeneratorOptions } from "@prisma/generator-helper";
import { logger } from "@prisma/sdk";
import { GENERATOR_NAME } from "./constants";
import { handleGenerateError } from "./error-handler";
import { PrismaGenerator } from "./generator";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require("../package.json");

generatorHandler({
    onManifest() {
        logger.info(`${GENERATOR_NAME}:Registered`);
        return {
            version,
            defaultOutput: "../base",
            prettyName: GENERATOR_NAME,
            requiresGenerators: ["prisma-client-js"]
        };
    },
    onGenerate: async (options: GeneratorOptions) => {
        try {
            logger.info(`${GENERATOR_NAME}:Registered again`);
            return await PrismaGenerator.getInstance(options).run();
            return;
        } catch (error) {
            handleGenerateError(error as Error);
            return;
        }
    }
});
