import { GeneratorOptions } from "@prisma/generator-helper";
import { logger, parseEnvValue } from "@prisma/sdk";
import path from "path";
import { Options, resolveConfig } from "prettier";
import { COMMENT_DISCLAIMER } from "./constants";
import { EnumConverter, ModelConverter } from "./converters";
import { GeneratorPathNotExists } from "./error-handler";
import { writeFileSafely } from "./utils/write-file";
export const PrismaNestBaseGeneratorOptions = {
    makeIndexFile: {
        desc: "make index file",
        defaultValue: true
    },
    dryRun: {
        desc: "dry run",
        defaultValue: true
    },
    separateRelationFields: {
        desc: "separate relation fields",
        defaultValue: false
    },
    useSwagger: {
        desc: "use swagger decorator",
        defaultValue: true
    },
    output: {
        desc: "output path",
        defaultValue: "./base"
    }
} as const;

export type PrismaNestBaseGeneratorOptionsKeys =
    keyof typeof PrismaNestBaseGeneratorOptions;
export type PrismaNestBaseGeneratorConfig = Partial<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Record<PrismaNestBaseGeneratorOptionsKeys, any>
>;

export class PrismaGenerator {
    static instance: PrismaGenerator;
    _options: GeneratorOptions;
    _prettierOptions: Options;
    rootPath!: string;
    clientPath!: string;
    _enums: EnumConverter[] = [];
    _models: ModelConverter[] = [];
    commentdisclaimer = COMMENT_DISCLAIMER;
    // wrapper: Wrapper;

    constructor(options: GeneratorOptions) {
        // if (options) {
        //     this._options = options;
        // }
        this._options = options;

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const output = parseEnvValue(this._options.generator.output!);

        this._prettierOptions =
            resolveConfig.sync(output, { useCache: false }) ||
            (resolveConfig.sync(process.cwd()) as Options);
    }

    static getInstance(options: GeneratorOptions): PrismaGenerator {
        if (PrismaGenerator.instance) {
            return PrismaGenerator.instance;
        }
        PrismaGenerator.instance = new PrismaGenerator(options);
        return PrismaGenerator.instance;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    public get options() {
        return this._options;
    }

    public set options(value) {
        this._options = value;
    }

    public get prettierOptions(): Options {
        return this._prettierOptions;
    }

    public set prettierOptions(value) {
        this._prettierOptions = value;
    }

    getClientImportPath(): string {
        if (!this.rootPath || !this.clientPath) {
            throw new GeneratorPathNotExists();
        }
        return path
            .relative(this.rootPath, this.clientPath)
            .replace("node_modules/", "");
    }

    setPrismaClientPath(): void {
        const { otherGenerators, schemaPath } = this.options;

        this.rootPath = schemaPath.replace("/prisma/schema.prisma", "");
        const defaultPath = path.resolve(
            this.rootPath,
            "node_modules/@prisma/client"
        );
        const clientGenerator = otherGenerators.find(
            (g) => g.provider.value === "prisma-client-js"
        );

        this.clientPath = clientGenerator?.output?.value ?? defaultPath;
    }

    genEnums(): void {
        this._options.dmmf.datamodel.enums.forEach(async (enumInfo) => {
            this._enums.push(new EnumConverter(enumInfo));
        });
        logger.info(`GENERATED_ENUMS: ${JSON.stringify(this._enums)}`);
    }
    writeEnums = async (): Promise<void> => {
        this._enums.forEach(async (_enum) => {
            const enumString = _enum.stringify();
            const writeLocation = path.join(
                this._options.generator.output?.value || "",
                `enums`,
                `${_enum._name}.ts`
            );

            await writeFileSafely(
                writeLocation,
                this.commentdisclaimer + enumString
            );
        });
    };

    async genModels(): Promise<void> {
        for await (const modelInfo of this._options.dmmf.datamodel.models) {
            logger.info(`going to process model: ${modelInfo}`);
            const tsModel = new ModelConverter(modelInfo);
            this._models.push(tsModel);
        }
    }

    /**
     * Writer Function
     * Moved to here as they pass testing
     */
    async writer(): Promise<void> {
        await this.writeEnums();
    }

    run = async (): Promise<void> => {
        logger.info(`running generator 🔥 `);
        // Generate the enum object
        this.genEnums();

        // Generate the models as the base for everything
        await this.genModels();
        // run writer function
        await this.writer();
    };
}
