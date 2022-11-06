import { DMMF } from "@prisma/generator-helper";
import { logger } from "@prisma/sdk";
import { INameCases } from "src/interfaces/INameCases";
import { toNameCases } from "src/utils/util";

export class ModelConverter {
    // provided name
    name: string;
    nameValues: INameCases;

    // DMMF
    _rawModel: DMMF.Model;

    constructor(options: DMMF.Model) {
        this.name = options.name;
        logger.info(
            `CONSTRUCTING MODEL ${this.name} from ${JSON.stringify(options)}`
        );
        this.nameValues = toNameCases(this.name);
        this._rawModel = options;
    }
}
