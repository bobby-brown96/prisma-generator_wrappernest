import { DMMF } from "@prisma/generator-helper";
import { logger } from "@prisma/sdk";
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
        if (options.readonly) {
            this.readonly = options.readonly;
        }
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
        logger.info(`ugly ${ugly}`);
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

const u = {
    _enums: ["EnumUserRole"],
    _relations: [
        {
            relationName: "BookToUser",
            relationFromFields: [],
            relationToFields: [],
            isMandatory: false
        }
    ],
    _relationStrings: ["Book"],
    _imports: [],
    name: "User",
    nameValues: {
        camel: "user",
        snake: "user",
        pascal: "User",
        caps: "USER",
        title: "User"
    },
    _rawModel: {
        name: "User",
        dbName: null,
        fields: [
            {
                name: "createdAt",
                kind: "scalar",
                isList: false,
                isRequired: true,
                isUnique: false,
                isId: false,
                isReadOnly: false,
                hasDefaultValue: true,
                type: "DateTime",
                default: { name: "now", args: [] },
                isGenerated: false,
                isUpdatedAt: false,
                documentation: "B$CreatedAt"
            },
            {
                name: "email",
                kind: "scalar",
                isList: false,
                isRequired: true,
                isUnique: false,
                isId: false,
                isReadOnly: false,
                hasDefaultValue: false,
                type: "String",
                isGenerated: false,
                isUpdatedAt: false,
                documentation: "B$Email"
            },
            {
                name: "firstName",
                kind: "scalar",
                isList: false,
                isRequired: false,
                isUnique: false,
                isId: false,
                isReadOnly: false,
                hasDefaultValue: false,
                type: "String",
                isGenerated: false,
                isUpdatedAt: false
            },
            {
                name: "id",
                kind: "scalar",
                isList: false,
                isRequired: true,
                isUnique: false,
                isId: true,
                isReadOnly: false,
                hasDefaultValue: true,
                type: "String",
                default: { name: "cuid", args: [] },
                isGenerated: false,
                isUpdatedAt: false
            },
            {
                name: "lastName",
                kind: "scalar",
                isList: false,
                isRequired: false,
                isUnique: false,
                isId: false,
                isReadOnly: false,
                hasDefaultValue: false,
                type: "String",
                isGenerated: false,
                isUpdatedAt: false
            },
            {
                name: "password",
                kind: "scalar",
                isList: false,
                isRequired: true,
                isUnique: false,
                isId: false,
                isReadOnly: false,
                hasDefaultValue: false,
                type: "String",
                isGenerated: false,
                isUpdatedAt: false,
                documentation: "B$Exclude"
            },
            {
                name: "roles",
                kind: "enum",
                isList: true,
                isRequired: true,
                isUnique: false,
                isId: false,
                isReadOnly: false,
                hasDefaultValue: false,
                type: "EnumUserRole",
                isGenerated: false,
                isUpdatedAt: false
            },
            {
                name: "updatedAt",
                kind: "scalar",
                isList: false,
                isRequired: true,
                isUnique: false,
                isId: false,
                isReadOnly: false,
                hasDefaultValue: false,
                type: "DateTime",
                isGenerated: false,
                isUpdatedAt: true
            },
            {
                name: "username",
                kind: "scalar",
                isList: false,
                isRequired: true,
                isUnique: true,
                isId: false,
                isReadOnly: false,
                hasDefaultValue: false,
                type: "String",
                isGenerated: false,
                isUpdatedAt: false
            },
            {
                name: "Book",
                kind: "object",
                isList: true,
                isRequired: true,
                isUnique: false,
                isId: false,
                isReadOnly: false,
                hasDefaultValue: false,
                type: "Book",
                relationName: "BookToUser",
                relationFromFields: [],
                relationToFields: [],
                isGenerated: false,
                isUpdatedAt: false
            }
        ],
        primaryKey: null,
        uniqueFields: [],
        uniqueIndexes: [],
        isGenerated: false
    },
    pk: { name: "id", auto: true },
    _fields: [
        {
            pk: false,
            unique: false,
            kind: "scalar",
            required: true,
            readonly: false,
            docs: [],
            _enums: [],
            _relations: [],
            name: "createdAt",
            prismaType: "DateTime",
            tsType: "Date"
        },
        {
            pk: false,
            unique: false,
            kind: "scalar",
            required: true,
            readonly: false,
            docs: [],
            _enums: [],
            _relations: [],
            name: "email",
            prismaType: "String",
            tsType: "string"
        },
        {
            pk: false,
            unique: false,
            kind: "scalar",
            required: false,
            readonly: false,
            docs: [],
            _enums: [],
            _relations: [],
            name: "firstName",
            prismaType: "String",
            tsType: "string"
        },
        {
            pk: true,
            unique: false,
            kind: "scalar",
            required: true,
            readonly: false,
            docs: [],
            _enums: [],
            _relations: [],
            name: "id",
            prismaType: "String",
            tsType: "string"
        },
        {
            pk: false,
            unique: false,
            kind: "scalar",
            required: false,
            readonly: false,
            docs: [],
            _enums: [],
            _relations: [],
            name: "lastName",
            prismaType: "String",
            tsType: "string"
        },
        {
            pk: false,
            unique: false,
            kind: "scalar",
            required: true,
            readonly: false,
            docs: [],
            _enums: [],
            _relations: [],
            name: "password",
            prismaType: "String",
            tsType: "string"
        },
        {
            pk: false,
            unique: false,
            kind: "enum",
            required: true,
            readonly: false,
            docs: [],
            _enums: ["EnumUserRole"],
            _relations: [],
            name: "roles",
            prismaType: "EnumUserRole",
            tsType: "EnumUserRole"
        },
        {
            pk: false,
            unique: false,
            kind: "scalar",
            required: true,
            readonly: false,
            docs: [],
            _enums: [],
            _relations: [],
            name: "updatedAt",
            prismaType: "DateTime",
            tsType: "Date"
        },
        {
            pk: false,
            unique: true,
            kind: "scalar",
            required: true,
            readonly: false,
            docs: [],
            _enums: [],
            _relations: [],
            name: "username",
            prismaType: "String",
            tsType: "string"
        },
        {
            pk: false,
            unique: false,
            kind: "object",
            required: true,
            readonly: false,
            docs: [],
            _enums: [],
            _relations: ["Book"],
            name: "Book",
            prismaType: "Book",
            tsType: "Book"
        }
    ]
};
