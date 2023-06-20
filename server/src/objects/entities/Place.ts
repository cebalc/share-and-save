import PlaceRow from "../rows/PlaceRow";
import UniqueStringEntity from "./UniqueStringEntity";

class Place extends UniqueStringEntity {

    public static readonly NULL: Place = new Place(0, "");

    public static ofRow(row: PlaceRow): Place {
        return new Place(row.id, row.name);
    }

    public static idWrapper(id: number): Place {
        return new Place(id, "");
    }
}

export default Place;
