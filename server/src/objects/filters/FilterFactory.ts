import {body, ValidationChain} from "express-validator";
import strip_tags from "striptags";
import {globalTrim} from "../../modules/sanitizers";

class FilterFactory {

    public static id(): ValidationChain {
        return body("id")
            .exists()
            .isInt({min: 0});
    }

    public static userName(): ValidationChain {
        return body("name", "Máximo 25 caracteres, sin símbolos")
            .exists()
            .customSanitizer(value => strip_tags(value))
            .customSanitizer(value => globalTrim(value))
            .matches(/^[a-záéíóú\s]{1,25}$/i);
    }

    public static userSurname(): ValidationChain {
        return body("surname", "Máximo 50 caracteres, sin símbolos")
            .exists()
            .customSanitizer(value => strip_tags(value))
            .customSanitizer(value => globalTrim(value))
            .matches(/^[a-záéíóú\s]{1,50}$/i);
    }

    public static userEmail(): ValidationChain {
        return body("email", "Dirección válida de hasta 50 caracteres")
            .exists()
            .notEmpty()
            .isEmail()
            .normalizeEmail({
                all_lowercase: true,
                gmail_remove_dots: true
            });
    }

    public static password(old: boolean = false, toBeStored: boolean = false, optional: boolean = false): ValidationChain {
        let fieldName: string = (old ? "oldPass" : "pass");
        let errorMsg: string = (toBeStored ?
            "Entre 8 y 15 caracteres incluyendo mayúsculas, minúsculas, números y símbolos ($, @, !, %, *, ?, &, -)"
            :
            "Debes introducir una contraseña");
        let chain: ValidationChain = body(fieldName, errorMsg);
        if(!optional) {
            chain = chain.exists();
        }
        chain = chain.customSanitizer(value => strip_tags(value));
        if(toBeStored) {
            chain = chain.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@!%*?&-])[A-Za-z\d$@!%*?&-]{8,15}$/);
        }
        if(!optional) {
            chain = chain.notEmpty();
        }
        return chain;
    }
}

export default FilterFactory;
