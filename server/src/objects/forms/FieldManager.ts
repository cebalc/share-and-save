import FieldValidator from "./FieldValidator";

abstract class FieldManager<T, U extends FieldValidator<T>> {

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
    private validator: U;

    public constructor(rawValue: any) {
        this.sanitizedValue = this.sanitize(rawValue);
        this.validator = this.createValidator(this.sanitizedValue);
    }

    protected abstract sanitize(rawValue: any): T;

    protected abstract createValidator(sanitizedValue: T): U;

    public validValue(): boolean {
        return this.validator.validValue();
    }

    public getFilteredValue(): T {
        return this.sanitizedValue;
    }

    public getError(): string {
        return this.validator.getError();
    }
}

export default FieldManager;
