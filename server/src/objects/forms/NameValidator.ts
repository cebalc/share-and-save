import FieldValidator from "./FieldValidator";
import strip_tags from "striptags";

class NameValidator extends FieldValidator<string> {

    private static VALID_PATTERN: RegExp = /^[a-záéíóú\s]{1,25}$/i;
    private static ERROR_MSG: string = "Máximo 25 caracteres, sin símbolos";

    public constructor(rawValue: any) {
        super(rawValue);
    }

    protected sanitize(rawValue: any): string {
        return FieldValidator.globalTrim(strip_tags(rawValue));
    }

    protected validate(): boolean {
        let valid: boolean = NameValidator.VALID_PATTERN.test(super.getSanitizedValue());
        if(!valid) {
            super.setErrorMsg(NameValidator.ERROR_MSG);
        }
        return valid;
    }
}

export default NameValidator;