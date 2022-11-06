import { DMMF } from "@prisma/generator-helper";

export class EnumConverter {
    _name: string;
    _values: DMMF.EnumValue[];
    valString: string;

    constructor(options: DMMF.DatamodelEnum) {
        this._name = options.name;
        this._values = options.values;
        this.valString = this.joinedValues();
    }

    private joinedValues(): string {
        return this._values.map(({ name }) => `${name}="${name}"`).join(",\n");
    }
}
