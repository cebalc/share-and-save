import FieldValidator from "./FieldValidator";

class NameValidator extends FieldValidator<string> {

    private static VALID_PATTERN: RegExp = /^[a-záéíóú\s]{1,25}$/i;
    private static ERROR_MSG: string = "Máximo 25 caracteres, sin símbolos"

    public validValue(): boolean {
        return new RegExp(NameValidator.VALID_PATTERN).test(this.fieldValue);
    }

    public getError(): string {
        if(!this.validValue()) {
            return NameValidator.ERROR_MSG;
        } else {
            return "";
        }
    }
}

export default NameValidator;