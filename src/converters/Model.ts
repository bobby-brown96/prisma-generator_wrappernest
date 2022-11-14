/* eslint-disable @typescript-eslint/ban-ts-comment */
import { DMMF } from "@prisma/generator-helper";
import { logger } from "@prisma/sdk";
import {
    DecoratorComponent,
    FieldComponent,
    RelationComponent
} from "../components";
import { IField, IImport, INameCases, IPrimaryKey } from "../interfaces";
import {
    classGenerator,
    importGeneratorEnum,
    importGeneratorGeneral,
    importGeneratorModel
} from "../templates";
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

        this.nameValues = toNameCases(this.name);
        this._rawModel = options;
        this.pk = this.createIdObj(options);
        this._relations = this.mapRelations(options.fields);

        this._fields = this.mapFields(options.fields);
        this.markRelationFromFieldsOptional();

        this.decsToImports(this.getAllDecorators());
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
    createIdObj(options: DMMF.Model): IPrimaryKey {
        const fields = options.fields;
        const idTrue = fields.find((x) => x.isId);
        if (idTrue)
            return {
                name: idTrue.name,
                type: idTrue.Type,
                auto: !!idTrue.default?.toString(),
                isComposite: false
            };
        else {
            logger.info(
                "working on composites" + JSON.stringify(options.primaryKey)
            );
            const _pk = options.primaryKey;

            if (!_pk) throw new Error("NO ID FOUND");
            const pkFields = _pk.fields.join("_");

            return {
                isComposite: true,
                type: "string",
                name: pkFields,
                auto: false
            };
        }
    }

    mapRelations(options: DMMF.Field[]): RelationComponent[] {
        const filteredRelations = options.filter((x) => x.relationName);
        return filteredRelations.map((f): RelationComponent => {
            return {
                relationName: f.relationName || "",
                relationFromFields: f.relationFromFields || [],
                relationToFields: f.relationToFields || [],
                isMandatory: false,
                obj: f.type
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

    stringifyFields(): string {
        return this._fields
            .map((f) => {
                return f.stringify();
            })
            .join(`\n\n`);
    }

    stringifyImports(): string {
        let iString = "";

        this._imports.forEach(
            (d) =>
                (iString += `${importGeneratorGeneral({
                    NAME: d.NAME,
                    MODULE: d.MODULE
                })};\n`)
        );
        return iString;
    }

    stringifyEntityImports(): string {
        let iString = "";

        this._enums.forEach((e) => (iString += `${importGeneratorEnum(e)};\n`));

        this._relations.forEach((r) => {
            if (r.obj !== this.nameValues.title)
                iString += `${importGeneratorModel(r.obj)};\n`;
        });
        this._imports.forEach(
            (d) =>
                (iString += `${importGeneratorGeneral({
                    NAME: d.NAME,
                    MODULE: d.MODULE
                })};\n`)
        );
        return iString;
    }

    stringifyEntity(): string {
        const fieldString = this.stringifyFields();
        //  const decorators = this.getAllDecorators();
        return classGenerator(
            this.nameValues.pascal,
            fieldString,
            this.stringifyEntityImports()
        );
    }

    getAllDecorators(): DecoratorComponent[] {
        let allDecorators = this._fields.flatMap((x) => x._docs);
        allDecorators = [...new Set(allDecorators)];
        //   logger.info(`all decorators: ${JSON.stringify(allDecorators)}`);
        return allDecorators;
    }

    decsToImports(options: DecoratorComponent[]): void {
        const m = options.map((o) => {
            return {
                importFrom: o.importFrom,
                importName: o.importName
            };
        });
        const reduced = m.reduce((group, i) => {
            const { importFrom } = i;
            //@ts-ignore
            group[importFrom] = group[importFrom] ?? [];
            //@ts-ignore
            group[importFrom].push(i.importName);
            return group;
        }, {});

        let i: IImport[] = [];
        for (const [k, v] of Object.entries(reduced)) {
            const t = [...new Set(v as string[])];
            if (k && k !== "")
                i.push({
                    NAME: v ? `{${t.join(",")}}` : "*",
                    MODULE: k
                });
        }
        i = [...new Set(i)];

        this._imports.push(...i);
    }

    // FUNCTIONS FOR GETTING FIELDS
    createFields(): FieldComponent[] {
        return this._fields.filter(
            (f) => !f.readonly && !["createdAt", "updatedAt"].includes(f.name)
        );
    }
}
