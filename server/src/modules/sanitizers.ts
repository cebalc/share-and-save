/**
 * Trims the given string and converts any inner whitespaces (space, tab...) into either:
 * - a single space (e. g. "  hello   world  " becomes "hello world")
 * - nothing (e.g. "  hello   world  " becomes "helloworld")
 * @param text String to be processed
 * @param leaveOneSpace true to preserve single spaces, false to remove all whitespaces
 * @returns Processed string
 */
function globalTrim(text: string, leaveOneSpace: boolean = true): string {
    let trimmed: string = text.trim();
    return trimmed.replace(/\s{1,}/g, leaveOneSpace ? " " : "");
}

export { globalTrim };
