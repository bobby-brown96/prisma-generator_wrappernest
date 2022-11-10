import { logger } from "@prisma/sdk";
import { IDecoration } from "../interfaces";

export class DecoratorComponent {
    raw: string;
    importName = "";
    importFrom = "";
    decorateName = "";

    constructor(options: { name: string }) {
        this.raw = options.name;

        const result = DecoratorComponent.MAPPED_DECORATIONS.find(
            (x) => x.input === this.raw
        );
        if (!result) {
            logger.info("UNMAPPED_DECORATOR " + this.raw);
        } else {
            this.importName = result.importName;
            this.importFrom = result.importFrom;
            this.decorateName = result.output.join();
        }
    }

    static MAPPED_DECORATIONS: IDecoration[] = [
        {
            input: "Prop",
            output: ["@ApiProperty()"],
            importFrom: "@nestjs/swagger",
            importName: "ApiProperty"
        },
        {
            input: "B$Email",
            output: ["@IsEmail()"],
            importFrom: "class-validator",
            importName: "IsEmail"
        },
        {
            input: "B$Exclude",
            output: ["@Exclude()"],
            importFrom: "class-transformer",
            importName: "Exclude"
        },
        {
            input: "B$Expose",
            output: ["@Expose()"],
            importFrom: "class-transformer",
            importName: "Expose"
        },
        {
            input: "B$Type",
            output: ["@Type()"],
            importFrom: "class-transformer",
            importName: "Type"
        },
        {
            input: "IsDate",
            output: ["@IsDate()"],
            importFrom: "class-validator",
            importName: "IsDate"
        },
        {
            input: "IsBoolean",
            output: ["@IsBoolean()"],
            importFrom: "class-validator",
            importName: "IsBoolean"
        },
        {
            input: "IsDecimal",
            output: ["@IsDecimal()"],
            importFrom: "class-validator",
            importName: "IsDecimal"
        },
        {
            input: "IsEnum",
            output: ["@IsEnum()"],
            importFrom: "class-validator",
            importName: "IsEnum"
        },
        {
            input: "IsNotEmpty",
            output: ["@IsNotEmpty()"],
            importFrom: "class-validator",
            importName: "IsNotEmpty"
        },
        {
            input: "IsNumber",
            output: ["@IsNumber()"],
            importFrom: "class-validator",
            importName: "IsNumber"
        },
        {
            input: "IsObject",
            output: ["@IsObject()"],
            importFrom: "class-validator",
            importName: "IsObject"
        },
        {
            input: "IsOptional",
            output: ["@IsOptional()"],
            importFrom: "class-validator",
            importName: "IsOptional"
        },
        {
            input: "IsJSON",
            output: ["@IsJSON()"],
            importFrom: "class-validator",
            importName: "IsJSON"
        },
        {
            input: "IsInt",
            output: ["@IsInt()"],
            importFrom: "class-validator",
            importName: "IsInt"
        },
        {
            input: "ValidateNested",
            output: ["@ValidateNested()"],
            importFrom: "class-validator",
            importName: "ValidateNested"
        },
        {
            input: "IsString",
            output: ["@IsString()"],
            importFrom: "class-validator",
            importName: "IsString"
        }
    ];
}
