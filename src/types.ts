export type NameCases = {
    camel: string;
    snake: string;
    pascal: string;
    caps: string;
    title: string;
};

/** BigInt| Boolean, Bytes, DateTime, Decimal, Float, Int, JSON, String, $ModelName */
export type DefaultPrismaFieldType =
    | "BigInt"
    | "Boolean"
    | "Bytes"
    | "DateTime"
    | "Decimal"
    | "Float"
    | "Int"
    | "Json"
    | "String";

export type InOut = {
    input: string;
    output: string[];
};

export const ClassTransformers = ["Exclude", "Expose", "Type"] as const;

export const ClassValidators = [
    "IsArray",
    "IsBoolean",
    "IsDate",
    "IsDecimal",
    "IsEnum",
    "IsNotEmpty",
    "IsNumber",
    "IsObject",
    "IsOptional",
    "IsJSON",
    "IsInt",
    "ValidateNested",
    "IsString",
    "IsEmail"
] as const;
