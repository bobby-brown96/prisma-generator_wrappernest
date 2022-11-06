import { DMMF } from "@prisma/generator-helper";
import { logger } from "@prisma/sdk";

export class ModelConverter {
    // provided name
    name: string;

    constructor(options: DMMF.Model) {
        this.name = options.name;
        logger.info(
            `CONSTRUCTING MODEL ${this.name} from ${JSON.stringify(options)}`
        );
    }
}
