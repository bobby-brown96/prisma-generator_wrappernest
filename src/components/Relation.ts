export class RelationComponent {
    relationName: string;
    relationFromFields: string[];
    relationToFields: string[];
    isMandatory = false;
    obj: string;

    constructor(options: {
        relationName: string;
        relationFromFields: string[];
        relationToFields: string[];
        obj: string;
    }) {
        this.relationName = options.relationName;
        this.relationFromFields = options.relationFromFields;
        this.relationToFields = options.relationToFields;
        this.obj = options.obj;
    }
}
