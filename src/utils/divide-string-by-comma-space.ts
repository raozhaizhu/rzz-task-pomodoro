export function divideStringByCommaSpace(value: string): string[] {
    const tagsArray = value
        .split(/[, ]/)
        .map((tag) => tag.trim())
        .filter((tag) => tag);

    return tagsArray ? tagsArray : [];
}
