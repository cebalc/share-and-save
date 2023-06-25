import RecordType from "../enums/RecordType";
import Workspace from "./Workspace";
import User from "./User";
import Category from "./Category";
import Place from "./Place";
import FullRecordRow from "../rows/FullRecordRow";
import RecordRow from "../rows/RecordRow";

class Record {

    public id: number;
    public type: RecordType;
    public date: string;
    public description: string;
    public amount: number;
    public reference: string;
    public shared: boolean;
    public category: Category;
    public place: Place;
    public user: User;
    public workspace: Workspace;

    public static readonly NEW: Record = new Record(0, RecordType.SPEND, "", "", 0.0,
        "", false, Category.NULL, Place.NULL, User.GUEST, Workspace.NULL);

    public static ofRow(row: RecordRow): Record {
        return new Record(
            row.id,
            RecordType.of(row.type_id),
            row.date,
            row.description,
            row.amount,
            row.reference,
            row.shared,
            Category.idWrapper(row.category_id),
            Place.idWrapper(row.place_id),
            User.idWrapper(row.user_id),
            Workspace.idWrapper(row.workspace_id)
        );
    }

    public static ofFullRow(row: FullRecordRow): Record {
        let record: Record = Record.ofRow(row);
        record.category.name = row.category_name;
        record.place.name = row.place_name;
        record.user.name = row.user_name;
        return record;
    }

    constructor(id: number, type: RecordType, date: string, description: string, amount: number, reference: string,
                shared: boolean, category: Category, place: Place, user: User, workspace: Workspace) {
        this.id = id;
        this.type = type;
        this.date = date;
        this.description = description;
        this.amount = amount;
        this.reference = reference;
        this.shared = shared;
        this.category = category;
        this.place = place;
        this.user = user;
        this.workspace = workspace;
    }
}

export default Record;
