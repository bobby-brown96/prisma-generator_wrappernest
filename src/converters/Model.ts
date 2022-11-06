import { DMMF } from "@prisma/generator-helper";
import { logger } from "@prisma/sdk";
import { FieldComponent, RelationComponent } from "../components";
import { IField, IImport, INameCases, IPrimaryKey } from "../interfaces";
import { DefaultPrismaFieldType } from "../types";
import { convertBool, toNameCases } from "../utils/util";

export class ModelConverter {
    // provided name
    name: string;
    nameValues: INameCases;

    // DMMF
    _rawModel: DMMF.Model;

    pk: IPrimaryKey;

    _fields: FieldComponent[];
    _enums: string[] = [];
    _relations: RelationComponent[] = [];
    _relationStrings: string[] = [];
    _imports: IImport[] = [];

    constructor(options: DMMF.Model) {
        this.name = options.name;
        logger.info(
            `CONSTRUCTING MODEL ${this.name} from ${JSON.stringify(options)}`
        );

        this.nameValues = toNameCases(this.name);
        this._rawModel = options;
        this.pk = this.createIdObj(options.fields);
        this._relations = this.mapRelations(options.fields);

        this._fields = this.mapFields(options.fields);
        this.markRelationFromFieldsOptional();
        logger.info(
            `CONSTRUCTED MODEL ${this.name} to ${JSON.stringify(this)}`
        );
    }
    markRelationFromFieldsOptional(): void {
        const relateFrom = this._relations.flatMap((x) => x.relationFromFields);

        if (relateFrom.length === 0) return;
        for (let i = 0; i < this._fields.length; i++) {
            if (relateFrom.includes(this._fields[i].name)) {
                this._fields[i].required = false;
            }
        }
    }
    createIdObj(options: DMMF.Field[]): IPrimaryKey {
        const idTrue = options.find((x) => x.isId);
        if (idTrue)
            return {
                name: idTrue.name,
                type: idTrue.Type,
                auto: !!idTrue.default?.toString()
            };
        else throw new Error("NO ID FOUND");
    }

    mapRelations(options: DMMF.Field[]): RelationComponent[] {
        const filteredRelations = options.filter((x) => x.relationName);
        return filteredRelations.map((f): RelationComponent => {
            return {
                relationName: f.relationName || "",
                relationFromFields: f.relationFromFields || [],
                relationToFields: f.relationToFields || [],
                isMandatory: false
            };
        });
    }

    mapFields(options: DMMF.Field[]): FieldComponent[] {
        const fields: IField[] = options.map((f): IField => {
            return {
                name: f.name,
                type: f.type as DefaultPrismaFieldType,
                pk: convertBool(f.isId),
                kind: f.kind,
                unique: convertBool(f.isUnique),
                required: convertBool(f.isRequired),
                readonly: convertBool(f.isReadOnly),
                decorations: f.documentation || "",
                ...(f.kind === "object" &&
                    f.relationFromFields &&
                    f.relationName &&
                    f.relationToFields && {
                        relation: {
                            relationFromFields: f.relationFromFields,
                            relationName: f.relationName,
                            relationToFields: f.relationToFields,
                            isMandatory: false
                        }
                    }),
                ...(f.relationFromFields && {
                    relationFromFields: f.relationFromFields
                })
            };
        });
        return this.toFieldComponent(fields);
    }

    toFieldComponent(options: IField[]): FieldComponent[] {
        return options.map((f) => {
            const temp = new FieldComponent(f);
            this._enums.push(...temp._enums);
            this._relationStrings.push(...temp._relations);
            return temp;
        });
    }
}

const book = {
    name: "Book",
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
            name: "id",
            kind: "scalar",
            isList: false,
            isRequired: true,
            isUnique: false,
            isId: true,
            isReadOnly: false,
            hasDefaultValue: true,
            type: "Int",
            default: { name: "autoincrement", args: [] },
            isGenerated: false,
            isUpdatedAt: false,
            documentation: "B$Pk"
        },
        {
            name: "isPrimary",
            kind: "scalar",
            isList: false,
            isRequired: false,
            isUnique: false,
            isId: false,
            isReadOnly: false,
            hasDefaultValue: false,
            type: "Boolean",
            isGenerated: false,
            isUpdatedAt: false
        },
        {
            name: "name",
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
            name: "owner",
            kind: "object",
            isList: false,
            isRequired: false,
            isUnique: false,
            isId: false,
            isReadOnly: false,
            hasDefaultValue: false,
            type: "User",
            relationName: "BookToUser",
            relationFromFields: ["ownerId"],
            relationToFields: ["id"],
            isGenerated: false,
            isUpdatedAt: false,
            documentation:
                "B$RelationRequired\nB$RelationCanCreateOnCreate\nB$RelationCanConnectOnCreate"
        },
        {
            name: "ownerId",
            kind: "scalar",
            isList: false,
            isRequired: false,
            isUnique: false,
            isId: false,
            isReadOnly: true,
            hasDefaultValue: false,
            type: "String",
            isGenerated: false,
            isUpdatedAt: false
        },
        {
            name: "primaryCurrencyCode",
            kind: "scalar",
            isList: false,
            isRequired: true,
            isUnique: false,
            isId: false,
            isReadOnly: false,
            hasDefaultValue: false,
            type: "String",
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
            isUpdatedAt: true,
            documentation: "B$ReadOnly"
        }
    ],
    primaryKey: null,
    uniqueFields: [],
    uniqueIndexes: [],
    isGenerated: false
};

const pbook = {
    _enums: [],
    _relations: [
        {
            relationName: "BookToUser",
            relationFromFields: ["ownerId"],
            relationToFields: ["id"],
            isMandatory: false
        }
    ],
    _relationStrings: ["User"],
    _imports: [],
    name: "Book",
    nameValues: {
        camel: "book",
        snake: "book",
        pascal: "Book",
        caps: "BOOK",
        title: "Book"
    },
    _rawModel: {
        name: "Book",
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
                name: "id",
                kind: "scalar",
                isList: false,
                isRequired: true,
                isUnique: false,
                isId: true,
                isReadOnly: false,
                hasDefaultValue: true,
                type: "Int",
                default: { name: "autoincrement", args: [] },
                isGenerated: false,
                isUpdatedAt: false,
                documentation: "B$Pk"
            },
            {
                name: "isPrimary",
                kind: "scalar",
                isList: false,
                isRequired: false,
                isUnique: false,
                isId: false,
                isReadOnly: false,
                hasDefaultValue: false,
                type: "Boolean",
                isGenerated: false,
                isUpdatedAt: false
            },
            {
                name: "name",
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
                name: "owner",
                kind: "object",
                isList: false,
                isRequired: false,
                isUnique: false,
                isId: false,
                isReadOnly: false,
                hasDefaultValue: false,
                type: "User",
                relationName: "BookToUser",
                relationFromFields: ["ownerId"],
                relationToFields: ["id"],
                isGenerated: false,
                isUpdatedAt: false,
                documentation:
                    "B$RelationRequired\nB$RelationCanCreateOnCreate\nB$RelationCanConnectOnCreate"
            },
            {
                name: "ownerId",
                kind: "scalar",
                isList: false,
                isRequired: false,
                isUnique: false,
                isId: false,
                isReadOnly: true,
                hasDefaultValue: false,
                type: "String",
                isGenerated: false,
                isUpdatedAt: false
            },
            {
                name: "primaryCurrencyCode",
                kind: "scalar",
                isList: false,
                isRequired: true,
                isUnique: false,
                isId: false,
                isReadOnly: false,
                hasDefaultValue: false,
                type: "String",
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
                isUpdatedAt: true,
                documentation: "B$ReadOnly"
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
            pk: true,
            unique: false,
            kind: "scalar",
            required: true,
            readonly: false,
            docs: [],
            _enums: [],
            _relations: [],
            name: "id",
            prismaType: "Int",
            tsType: "number"
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
            name: "isPrimary",
            prismaType: "Boolean",
            tsType: "boolean"
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
            name: "name",
            prismaType: "String",
            tsType: "string"
        },
        {
            pk: false,
            unique: false,
            kind: "object",
            required: false,
            readonly: false,
            docs: [],
            _enums: [],
            _relations: ["User"],
            name: "owner",
            prismaType: "User",
            tsType: "User"
        },
        {
            pk: false,
            unique: false,
            kind: "scalar",
            required: false,
            readonly: true,
            docs: [],
            _enums: [],
            _relations: [],
            name: "ownerId",
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
            name: "primaryCurrencyCode",
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
            name: "updatedAt",
            prismaType: "DateTime",
            tsType: "Date"
        }
    ]
};
