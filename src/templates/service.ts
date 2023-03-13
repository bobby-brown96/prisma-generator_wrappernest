import { NameCases } from "../types";

export const TService = (options: {
    header: string;
    imports: string;
    name: NameCases;
    body: string;
}): string => {
    return `${options.header}\n\n\n
    ${options.imports}\n
    @Injectable()
    export class ${options.name.title}ServiceBase {\n
        constructor(protected prisma: PrismaService) {}\n
        ${options.body}
    }`;
};

export const TServiceCrud = (options: NameCases): string => {
    return `
    async count<T extends Prisma.${options.title}CountArgs>(
        args: Prisma.SelectSubset<T, Prisma.${options.title}CountArgs>
      ): Promise<number> {
        return await this.prisma.${options.camel}.count(args);
      }

      async create<T extends Prisma.${options.title}CreateArgs>(
        args: Prisma.SelectSubset<T, Prisma.${options.title}CreateArgs>
      ): Promise<${options.title}> {
        return await this.prisma.${options.camel}.create<T>(args
        );
      }

    async findMany<T extends Prisma.${options.title}FindManyArgs>(
        args: Prisma.SelectSubset<T, Prisma.${options.title}FindManyArgs>
      ): Promise<${options.title}[]> {
        return await this.prisma.${options.camel}.findMany(args);
    }

    async  findOne<T extends Prisma.${options.title}FindUniqueArgs>(
        args: Prisma.SelectSubset<T, Prisma.${options.title}FindUniqueArgs>
      ): Promise<${options.title} | null>  {
        return await this.prisma.${options.camel}.findUnique(args);
    }

    async   update<T extends Prisma.${options.title}UpdateArgs>(
        args: Prisma.SelectSubset<T, Prisma.${options.title}UpdateArgs>
      ): Promise<${options.title}>  {
        return await this.prisma.${options.camel}.update<T>(args);
    }

    async   upsert<T extends Prisma.${options.title}UpsertArgs>(
      args: Prisma.SelectSubset<T, Prisma.${options.title}UpsertArgs>
    ): Promise<${options.title}>  {
      return await this.prisma.${options.camel}.upsert<T>(args);
  }

    async   remove<T extends Prisma.${options.title}DeleteArgs>(
        args: Prisma.SelectSubset<T, Prisma.${options.title}DeleteArgs>
      ): Promise<${options.title}>   {
        return await this.prisma.${options.camel}.delete(args);
    }`;
};
