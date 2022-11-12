import { DMMF } from "@prisma/generator-helper";
import { IField } from "../interfaces/IField";
import { INameCases } from "../interfaces/INameCases";
import { fieldGeneratorGeneral } from "../templates";
import { DefaultPrismaFieldType } from "../types";
import { toNameCases } from "../utils/util";
import { DecoratorComponent } from "./Decorator";
export class FieldComponent {
    name: string;
    pk = false;
    unique = false;
    kind: DMMF.FieldKind = "scalar";
    prismaType: DefaultPrismaFieldType;
    required = false;
    readonly = false;
    docString: string[] = [];
    _docs: DecoratorComponent[] = [];
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
            this.docString.push("IsNotEmpty");
            this.required = options.required;
        } else this.docString.push("IsOptional");

        if (
            options.readonly ||
            ["createdAt", "updatedAt"].includes(this.name)
        ) {
            this.readonly = true;
        } else this.docString.push("Prop");

        if (options.decorations)
            this.docString.push(...this.docsToArray(options.decorations));

        if (this.docString.length > 0) this._docs = this.createDecorators();

        this.mapFieldType();
    }

    mapFieldType(): void {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        this.tsType = FieldComponent.MappedTypes[this.prismaType];

        if (!this.tsType) {
            this.unMappedTypes();
            this.tsType = this.prismaType.startsWith("Enum")
                ? this.prismaType
                : `${this.prismaType}Base`;
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
        Boolean: "boolean",
        Float: "number",
        Json: "any"
    };

    prismaToDecorate(): void {
        switch (this.prismaType) {
            case "DateTime":
                this.docString.push("IsDate");
                break;
            case "String":
                this.docString.push("IsString");
                break;
            case "Boolean":
                this.docString.push("IsBoolean");
                break;
            case "BigInt":
                this.docString.push("IsInt");
                break;
        }
    }

    docsToArray(decorations: string): string[] {
        const ugly = decorations.split("\n");

        return ugly;
    }

    createDecorators(): DecoratorComponent[] {
        this.prismaToDecorate();
        return this.docString.map((name) => {
            const dec = new DecoratorComponent({ name });
            return dec;
        });
    }

    stringify = (): string => {
        let decVal = "";
        this._docs.forEach((d) => {
            decVal += `${d.decorateName}\n`;
        });
        const decString = fieldGeneratorGeneral(this.name, this.tsType, decVal);

        return decString;
    };
}
