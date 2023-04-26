import FieldValidator from "./FieldValidator";

class SurnameValidator extends FieldValidator<string> {

    private static VALID_PATTERN: RegExp = /^[a-záéíóú\s]{1,50}$/i;
    private static ERROR_MSG: string = "Máximo 50 caracteres, sin símbolos"

    public validValue(): boolean {
        return new RegExp(SurnameValidator.VALID_PATTERN).test(this.fieldValue);
    }

    public getError(): string {
        if(!this.validValue()) {
            return SurnameValidator.ERROR_MSG;
        } else {
            return "";
        }
    }
}

export default SurnameValidator;