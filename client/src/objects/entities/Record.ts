import RecordType from "../enums/RecordType";
import Workspace from "./Workspace";
import User from "./User";
import Category from "./Category";
import Place from "./Place";

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
        "", true, Category.NULL, Place.NULL, User.GUEST, Workspace.NULL);

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
