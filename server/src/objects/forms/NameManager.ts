import FieldManager from "./FieldManager";
import NameValidator from "./NameValidator";
import strip_tags from "striptags";

class NameManager extends FieldManager<string, NameValidator> {

    protected sanitize(rawValue: any): string {
        return FieldManager.globalTrim(strip_tags(rawValue));
    }

    protected createValidator(sanitizedValue: string): NameValidator {
        return new NameValidator(sanitizedValue);
    }
}

export default NameManager;
