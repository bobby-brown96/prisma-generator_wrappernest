import { DMMF } from "@prisma/generator-helper";
import { INameCases } from "src/interfaces/INameCases";
import { toNameCases } from "src/utils/util";
import { IField } from "../interfaces/IField";
import { DefaultPrismaFieldType } from "../types";
export class FieldComponent {
    name: string;
    pk = false;
    unique = false;
    kind: DMMF.FieldKind = "scalar";
    prismaType: DefaultPrismaFieldType;
    required = false;
    readonly = false;
    docs: string[] = [];
    _enums: string[] = [];
    _relations: string[] = [];
    tsType?: string;

    nameValues(): INameCases {
        if (!this.name) throw `CANNOT USE WITHOUT NAME DECLARED`;
        return toNameCases(this.name);
    }
    constructor(options: IField) {
        this.name = options.name;
        this.prismaType = options.type;
        if (options.kind) {
            this.kind = options.kind;
        }
        if (options.pk) {
            this.pk = options.pk;
        }
        if (options.unique) {
            this.unique = options.unique;
        }
        if (options.required) {
            this.required = options.required;
        }
        if (options.readonly) {
            this.readonly = options.readonly;
        }
    }

    mapFieldType(): void {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        this.tsType = FieldComponent.MappedTypes[this.prismaType];

        if (!this.tsType) {
            this.unMappedTypes();
            this.tsType = this.prismaType;
        }
    }

    private unMappedTypes(): void {
        // check if enum
        if (this.prismaType.startsWith("Enum")) {
            this._enums.push(`${this.prismaType}`);
        } else {
            this._relations.push(`${this.prismaType}`);
        }
    }

    static MappedTypes = {
        String: "string",
        Int: "number",
        DateTime: "Date",
        Boolean: "boolean"
    };

    prismaToDecorate(): void {
        switch (this.prismaType) {
            case "DateTime":
                this.docs.push("@IsDate()");
                break;
            case "String":
                this.docs.push("@IsString()");
                break;
            case "Boolean":
                this.docs.push("@IsBoolean()");
                break;
            case "BigInt":
                this.docs.push("@IsInt()");
                break;
        }
    }
}
