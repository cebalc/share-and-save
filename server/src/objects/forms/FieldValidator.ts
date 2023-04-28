abstract class FieldValidator<T> {

    /**
     * Trims the given string and converts any inner whitespaces (space, tab...)
     * into a single space (e. g. "  hello   world  " becomes "hello world")
     * @param text String to be processed
     * @returns Processed string
     */
    protected static globalTrim(text: string): string {
        return text.trim().replace(/\s{1,}/g, " ");
    }

    private sanitizedValue: T;
    private valid: boolean;
    private errorMsg: string;

    public constructor(rawValue: any) {
        this.sanitizedValue = this.sanitize(rawValue);
        this.valid = this.validate();
    }

    protected abstract sanitize(rawValue: any): T;

    protected abstract validate(): boolean;

    public getSanitizedValue(): T {
        return this.sanitizedValue;
    }

    public valueIsValid(): boolean {
        return this.valid;
    }

    protected setErrorMsg(errorMsg: string): void {
        this.errorMsg = errorMsg;
    }

    public getErrorMsg(): string {
        return this.errorMsg;
    }
}

export default FieldValidator;