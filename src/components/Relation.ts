export class RelationComponent {
    relationName: string;
    relationFromFields: string[];
    relationToFields: string[];
    isMandatory = false;

    constructor(options: {
        relationName: string;
        relationFromFields: string[];
        relationToFields: string[];
    }) {
        this.relationName = options.relationName;
        this.relationFromFields = options.relationFromFields;
        this.relationToFields = options.relationToFields;
    }
}
