import UniqueStringEntity from "./UniqueStringEntity";

class Place extends UniqueStringEntity {
    public static readonly NULL: Place = new Place(0, "");
}

export default Place;
