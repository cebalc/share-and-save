class RecordType {
    public static readonly SPEND: RecordType = new RecordType(1, "Gasto");
    public static readonly EARN: RecordType = new RecordType(2, "Ingreso");

    private static readonly OBJECT_ARRAY: RecordType[] = [
        this.SPEND,
        this.EARN
    ];

    public static values(): RecordType[] {
        return this.OBJECT_ARRAY;
    }

    public static of(id: number): RecordType {
        return this.OBJECT_ARRAY.find(object => object.id === id);
    }

    public id: number;
    public label: string;

    private constructor(id: number, label: string) {
        this.id = id;
        this.label = label;
    }
}

export default RecordType;
