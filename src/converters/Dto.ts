import { DMMF } from "@prisma/client/runtime";
import {
    createDtoGenerator,
    importGeneratorCreateDto,
    importGeneratorEnumDto,
    importGeneratorGeneral
} from "../templates";
import { DtoType } from "../types";

import { logger } from "@prisma/sdk";
import { FieldComponent, RelationComponent } from "../components";
import { ModelConverter } from "./Model";

export class DtoConverter extends ModelConverter {
    _createDtoFields: FieldComponent[];
    _updateDtoFields: FieldComponent[] = [];
    _createBody = "";
    _updateBody = "";
    _connectBody = "";
    dtoRelations: RelationComponent[];

    constructor(options: DMMF.Model) {
        super(options);
        this._createDtoFields = this.createFields();
        logger.info(`dto r: ${JSON.stringify(this._relations)}`);
        this.dtoRelations = this._relations.filter((r) =>
            this._createDtoFields.map((cdf) => cdf.name).includes(r.obj)
        );

        logger.info(`dto relations: ${JSON.stringify(this.dtoRelations)}`);
    }

    stringifyDtoImports(): string {
        let iString = "";

        this._enums.forEach(
            (e) => (iString += `${importGeneratorEnumDto(e)};\n`)
        );

        this.dtoRelations.forEach(
            (r) => (iString += `${importGeneratorCreateDto(r.obj)};\n`)
        );
        this._imports.forEach(
            (d) =>
                (iString += `${importGeneratorGeneral({
                    NAME: d.NAME,
                    MODULE: d.MODULE
                })};\n`)
        );
        return iString;
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
            this.nameValues.pascal,
            this.createDtoStringBody(),
            this.stringifyDtoImports()
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
