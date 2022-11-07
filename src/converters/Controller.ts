import { DMMF } from "@prisma/client/runtime";
import { ModelConverter } from "./Model";

export class ControllerConverter extends ModelConverter {
    constructor(options: DMMF.Model) {
        super(options);
    }
}
