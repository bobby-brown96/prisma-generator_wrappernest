import { DMMF } from "@prisma/generator-helper";
import { DefaultPrismaFieldType } from "../types";

export interface IRelation {
    relationName: string;
    relationFromFields: string[];
    relationToFields: string[];
    isMandatory: boolean;
}
export interface IField {
    name: string;
    pk?: boolean;
    unique?: boolean;
    kind?: DMMF.FieldKind;
    type: DefaultPrismaFieldType;
    required?: boolean;
    readonly?: boolean;
    decorations?: string;
    relationFromFields?: string[];
    relation?: IRelation;
}
