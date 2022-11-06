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
