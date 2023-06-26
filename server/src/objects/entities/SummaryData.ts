import RecordType from "../enums/RecordType";
import Category from "./Category";
import User from "./User";

interface UserSummary {
    user: User,
    value: number
}

interface CategorySummary {
    category: Category,
    users: UserSummary[]
}

interface SummaryData {
    type: RecordType;
    categories: CategorySummary[]
}

export { SummaryData, CategorySummary, UserSummary };
