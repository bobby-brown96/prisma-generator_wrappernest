import { DMMF } from "@prisma/generator-helper";
import { logger } from "@prisma/sdk";
import { FieldComponent } from "../components";
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
    // _relations: RelationComponent[] = [];
    _relations: string[] = [];
    _imports: IImport[] = [];

    constructor(options: DMMF.Model) {
        this.name = options.name;
        logger.info(
            `CONSTRUCTING MODEL ${this.name} from ${JSON.stringify(options)}`
        );

        this.nameValues = toNameCases(this.name);
        this._rawModel = options;
        this.pk = { name: "id", auto: true, type: "int" };
        this._fields = this.mapFields(options.fields);
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
            this._relations.push(...temp._relations);
            return temp;
        });
    }
}
