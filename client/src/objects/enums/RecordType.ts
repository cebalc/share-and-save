class RecordType {
    public static readonly SPEND: RecordType = new RecordType(1, "Gasto", "Pagado");
    public static readonly EARN: RecordType = new RecordType(2, "Ingreso", "Ingresadog");

    private static readonly OBJECT_ARRAY: RecordType[] = [
        this.SPEND,
        this.EARN
    ];

    public static values(): RecordType[] {
        return this.OBJECT_ARRAY;
    }

    public static of(id: number): RecordType | undefined {
        return this.OBJECT_ARRAY.find(object => object.id === id);
    }

    public readonly id: number;
    public readonly label: string;
    public readonly verb: string;

    private constructor(id: number, label: string, verb: string) {
        this.id = id;
        this.label = label;
        this.verb = verb;
    }
}

export default RecordType;
