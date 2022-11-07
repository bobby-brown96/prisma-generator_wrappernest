import { DMMF } from "@prisma/client/runtime";
import { ModelConverter } from "./Model";

export class DtoConverter extends ModelConverter {
    constructor(options: DMMF.Model) {
        super(options);
    }

    createDtoStringBody(): void {
        const temp = this.createFields();
    }
}
