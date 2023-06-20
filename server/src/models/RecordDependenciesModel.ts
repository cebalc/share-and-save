import Model from "./Model";
import Place from "../objects/entities/Place";
import PlaceRow from "../objects/rows/PlaceRow";

class RecordDependenciesModel extends Model {

    public async createPlace(name: string): Promise<Place> {
        let sqlQuery: string = "INSERT INTO place (name) VALUES (:name)";
        let insertId: number = await super.getSingleInsertedRecordId(sqlQuery, {"name": name});
        if(insertId == RecordDependenciesModel.ID_NULL) {
            return null;
        }
        return await this.getPlaceById(insertId);
    }

    private async getSinglePlace(fieldName: "id" | "name", value: number | string): Promise<Place> {
        let sqlQuery: string = `SELECT * FROM place WHERE ${fieldName} = :value`;
        let row: PlaceRow = await super.getSingleRecord<PlaceRow>(sqlQuery, {"value": value});
        return (row != null ? Place.ofRow(row) : null);
    }

    public async getPlaceById(placeId: number): Promise<Place> {
        return await this.getSinglePlace("id", placeId);
    }

    public async getPlaceByName(placeName: string): Promise<Place> {
        return await this.getSinglePlace("name", placeName);
    }

    public async placeNameExists(name: string): Promise<boolean> {
        return await this.getPlaceByName(name) != null;
    }
}

export default RecordDependenciesModel;
