import FieldManager from "./FieldManager";
import SurnameValidator from "./SurnameValidator";
import strip_tags from "striptags";

class NameManager extends FieldManager<string, SurnameValidator> {

    protected sanitize(rawValue: any): string {
        return FieldManager.globalTrim(strip_tags(rawValue));
    }

    protected createValidator(sanitizedValue: string): SurnameValidator {
        return new SurnameValidator(sanitizedValue);
    }
}

export default NameManager;
