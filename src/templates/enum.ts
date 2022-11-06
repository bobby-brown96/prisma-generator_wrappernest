export const TEnum = ({
    name,
    enumValues
}: {
    name: string;
    enumValues: string;
}): string => `export enum ${name} { \n${enumValues}\n }`;
