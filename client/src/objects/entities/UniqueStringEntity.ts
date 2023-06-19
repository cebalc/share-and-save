abstract class UniqueStringEntity {

    public id: number;
    public name: string;

    public constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}

export default UniqueStringEntity;
