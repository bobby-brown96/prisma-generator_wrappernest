import { DMMF } from "@prisma/client/runtime";
import { createDtoGenerator } from "../templates";
import { DtoType } from "../types";

import { FieldComponent } from "../components";
import { ModelConverter } from "./Model";

export class DtoConverter extends ModelConverter {
    _createDtoFields: FieldComponent[];
    _updateDtoFields: FieldComponent[] = [];
    _createBody = "";
    _updateBody = "";
    _connectBody = "";
    constructor(options: DMMF.Model) {
        super(options);
        this._createDtoFields = this.createFields();
    }

    createDtoStringBody(): string {
        return this._createDtoFields
            .map((f) => {
                return f.stringify();
            })
            .join(`\n\n`);
    }

    stringifyCreateDto(): string {
        return createDtoGenerator(
            this.nameValues.camel,
            this.createDtoStringBody(),
            this.stringifyEntityImports()
        );
    }

    stringifyDto(_init: DtoType): string {
        switch (_init) {
            case "CREATE": {
                return this.stringifyCreateDto();
            }
            case "UPDATE": {
                return "gonna update";
            }
            case "CONNECT": {
                return "gonna connect";
            }
        }
    }
}
