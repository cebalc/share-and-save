class RecordType {
    public static readonly SPEND: RecordType = new RecordType(1, "Gasto");
    public static readonly EARN: RecordType = new RecordType(2, "Ingreso");

    public static values(): RecordType[] {
        return [this.SPEND, this.EARN];
    }

    public id: number;
    public label: string;

    private constructor(id: number, label: string) {
        this.id = id;
        this.label = label;
    }
}

export default RecordType;
