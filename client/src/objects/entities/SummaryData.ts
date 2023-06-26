import RecordType from "../enums/RecordType";
import Category from "./Category";
import User from "./User";

interface SummaryData {
    type: RecordType,
    categories: {
        category: Category,
        users: {
            user: User,
            value: number
        }
    }
}

export default SummaryData;
