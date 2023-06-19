

/* ### Interfaces ### */
/**
 * Versión personalizada de Intl.DateTimeFormatOptions para incluir
 * la propiedad dateStyle, que no está en Typescript.
 */
interface DateTimeFormatOptions extends Intl.DateTimeFormatOptions {
    dateStyle?: "full" | "long" | "medium" | "short";
    timeStyle?: "full" | "long" | "medium" | "short";
}

/* ### Clases estáticas ### */
/** Clase con métodos estáticos para formatear fechas y horas */
class DateTimeTools {
    private static readonly LOCALE_ES: string = "es-ES";
    private static readonly LABEL_TODAY: string = "Today";
    private static readonly LABEL_YESTERDAY: string = "Yesterday";

    /** Obtiene la fecha en formato dd/mm/aa a partir de un objecto Date
     * @param date El objeto Date del que se quiere extraer la fecha
     * @returns La fecha formateada como string
     */
    public static getFormattedDate(date: Date): string {
        const DTF_OPTIONS: DateTimeFormatOptions = {
            dateStyle: "short"
        } as DateTimeFormatOptions;
        const DTF: Intl.DateTimeFormat = new Intl.DateTimeFormat(DateTimeTools.LOCALE_ES, DTF_OPTIONS);
        return DTF.format(date);
    }

    /**
     * Obtiene la hora en formato hh:mm a partir de un objeto Date
     * @param date El objeto Date del que se quiere extraer la fecha
     * @returns La hora formateada como string
     */
    public static getFormattedTime(date: Date): string {
        const DTF_OPTIONS: DateTimeFormatOptions = {
            timeStyle: "short"
        } as DateTimeFormatOptions;
        const DFT: Intl.DateTimeFormat = new Intl.DateTimeFormat(DateTimeTools.LOCALE_ES, DTF_OPTIONS);
        return DFT.format(date);
    }

    /**
     * Devuelve una marca de tiempo según la diferencia respecto a hoy (hh:mm, 'Ayer' o dd/mm/aa)
     * @param date El objeto Date del que se quiere averiguar la marca de tiempo
     * @returns La marca de tiempo como string
     */
    public static getVariableTimeLabel(date: Date): string {
        let dateStr: string = this.getFormattedDate(date); //Fecha de hoy
        let auxDate: Date = new Date(); //Objeto auxiliar para calcular las fechas de hoy y ayer
        let todayStr: string = this.getFormattedDate(auxDate);
        auxDate.setDate(auxDate.getDate() - 1);
        let yesterdayStr: string = this.getFormattedDate(auxDate);
        let finalLabel: string = dateStr;
        if(dateStr === todayStr) {
            finalLabel = this.getFormattedTime(date);
        } else if(dateStr === yesterdayStr) {
            finalLabel = this.LABEL_YESTERDAY;
        }
        return finalLabel;
    }

    /**
     * Devuelve una marca de fecha según la diferencia respecto a hoy ('Hoy', 'Ayer' o dd/mm/aa)
     * @param date El objeto Date del que se quiere averiguar la marca de tiempo
     * @returns La marca de tiempo como string
     */
    public static getVariableDateLabel(date: Date): string {
        let variableTimeLabel: string = this.getVariableTimeLabel(date);
        let regexpTime: RegExp = new RegExp(/\d{1,2}:\d{1,2}/); //Para hora en formato hh:mm
        if(regexpTime.test(variableTimeLabel)) {
            return this.LABEL_TODAY;
        } else {
            return variableTimeLabel;
        }
    }

    /**
     * Convierte un string con formato 'aaaa-mm-dd' en un objeto Date
     * @param dateString El string que se quiere convertir a objeto Date
     * @returns El objeto Date resultante o null si dateString no cumple el patrón de entrada
     */
    public static parseDate(dateString: string): Date | null {
        const regExp: RegExp = new RegExp(/^\d{4}(-\d{1,2}){2}$/);
        if(!regExp.test(dateString)) {
            return null;
        }
        return new Date(dateString);
    }
}

export default DateTimeTools;
