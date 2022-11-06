import fs from "fs";
import path from "path";
import prettier from "prettier";

export const writeFileSafely = async (
    writeLocation: string,
    content: string
): Promise<void> => {
    fs.mkdirSync(path.dirname(writeLocation), {
        recursive: true
    });

    fs.writeFileSync(writeLocation, await formatFile(content));
};

export const formatFile = (content: string): Promise<string> => {
    return new Promise((res, rej) => {
        const pConfig = prettier.resolveConfig.sync(process.cwd());

        if (!pConfig) {
            res(content);
        }

        try {
            // logger.info(`going to write ${content}`);
            const formatted = prettier.format(content, {
                ...pConfig,
                parser: "typescript"
            });

            res(formatted);
        } catch (error) {
            rej(error);
        }
    });
};
