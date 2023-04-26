abstract class FieldValidator<T> {

    protected fieldValue: T;

    public constructor(fieldValue: T) {
        this.fieldValue = fieldValue;
    }

    public abstract validValue(): boolean;

    public abstract getError(): string;
}

export default FieldValidator;