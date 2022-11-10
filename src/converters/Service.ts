import { DMMF } from "@prisma/generator-helper";
import { IImport } from "../interfaces";
import { importGeneratorGeneral, TService, TServiceCrud } from "../templates";
//import { logger } from "@prisma/sdk";

import { ModelConverter } from "./Model";

export class ServiceConverter extends ModelConverter {
    constructor(options: DMMF.Model) {
        super(options);
        this.serviceInitImports;
    }
    //
    serviceInitImports(): IImport[] {
        return [
            { NAME: `{Injectable}`, MODULE: `@nestjs/common` },
            {
                NAME: `{Prisma,${this.nameValues.title}}`,
                MODULE: `@prisma/client`
            },
            {
                NAME: `{PrismaService}`,
                MODULE: `nestjs-prisma`
            }
            // {
            //     NAME: `{${this.nameValues.title}}`,
            //     MODULE: `'../models/${this.nameValues.title}'`
            // }
        ];
        //this._imports.push(...defaultImports);
    }

    stringedImports(): string {
        let iString = "";
        this.serviceInitImports().forEach(
            (d) =>
                (iString += `${importGeneratorGeneral({
                    NAME: d.NAME,
                    MODULE: d.MODULE
                })};\n`)
        );
        return iString;
    }

    stringify = (): string => {
        const body = TServiceCrud(this.nameValues);
        const iString = this.stringedImports();

        return TService({
            header: "",
            imports: iString,
            body,
            name: this.nameValues
        });
    };
}
