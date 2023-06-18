import {body, ValidationChain} from "express-validator";
import strip_tags from "striptags";
import {globalTrim} from "../../modules/sanitizers";

class FilterFactory {

    public static id(fieldName: string = "id"): ValidationChain {
        return body(fieldName)
            .exists()
            .isInt({min: 0});
    }

    public static userName(fieldName: string = "name"): ValidationChain {
        return body(fieldName, "Máximo 25 caracteres, sin símbolos")
            .exists()
            .customSanitizer(value => strip_tags(value))
            .customSanitizer(value => globalTrim(value))
            .matches(/^[a-záéíóú\s]{1,25}$/i);
    }

    public static userSurname(fieldName: string = "surname"): ValidationChain {
        return body(fieldName, "Máximo 50 caracteres, sin símbolos")
            .exists()
            .customSanitizer(value => strip_tags(value))
            .customSanitizer(value => globalTrim(value))
            .matches(/^[a-záéíóú\s]{1,50}$/i);
    }

    public static userEmail(toBeStored: boolean = true, fieldName: string = "email"): ValidationChain {
        let errorMsg: string = (toBeStored ?
            "Dirección válida de hasta 50 caracteres"
            :
            "Debes introducir un email"
        );
        return body(fieldName, errorMsg)
            .exists()
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
        chain = (optional ? chain.optional({values: "falsy"}) : chain.exists())
            .customSanitizer(value => strip_tags(value));
        if(toBeStored) {
            chain = chain.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@!%*?&-])[A-Za-z\d$@!%*?&-]{8,15}$/);
        }
        if(!optional) {
            chain = chain.notEmpty();
        }
        return chain;
    }

    public static workspaceName(fieldName: string = "name"): ValidationChain {
        return body(fieldName, "Máximo 30 caracteres")
            .exists()
            .customSanitizer(value => strip_tags(value))
            .customSanitizer(value => globalTrim(value))
            .isLength({min: 1, max: 30});
    }

    public static workspaceDescription(fieldName: string = "description"): ValidationChain {
        return body(fieldName, "Opcional, máximo 100 caracteres")
            .customSanitizer(value => strip_tags(value))
            .customSanitizer(value => globalTrim(value))
            .isLength({max: 100});
    }

    public static cardName(): ValidationChain {
        return body("cardName", "Máximo 30 caracteres, sin números ni símbolos")
            .exists()
            .customSanitizer(value => strip_tags(value))
            .customSanitizer(value => globalTrim(value))
            .matches(/^[a-záéíóú\s]{1,30}$/i);
    }

    public static cardNumber(): ValidationChain {
        return body("cardNumber", "Introduce un número de tarjeta válido (16 cifras)")
            .exists()
            .customSanitizer(value => strip_tags(value))
            .customSanitizer(value => globalTrim(value, false))
            .customSanitizer(value => (<string>value).replace(/-|\./g, ""))
            .matches(/^\d{1,16}$/);
    }

    public static cardMonth(): ValidationChain {
        return body("month", "Mes inválido")
            .exists()
            .customSanitizer(value => strip_tags(value))
            .customSanitizer(value => globalTrim(value, false))
            .customSanitizer(value => (<string>value).replace(/-|\./g, ""))
            .matches(/^\d{2}$/);
    }

    public static cardYear(): ValidationChain {
        return body("year", "Año inválido")
            .exists()
            .customSanitizer(value => strip_tags(value))
            .customSanitizer(value => globalTrim(value, false))
            .customSanitizer(value => (<string>value).replace(/-|\./g, ""))
            .matches(/^\d{4}$/);
    }

    public static cardCVV(): ValidationChain {
        return body("cvv", "CVV inválido")
            .exists()
            .customSanitizer(value => strip_tags(value))
            .customSanitizer(value => globalTrim(value, false))
            .customSanitizer(value => (<string>value).replace(/-|\./g, ""))
            .matches(/^\d{3}$/);
    }
}

export default FilterFactory;
