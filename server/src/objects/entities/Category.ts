import UniqueStringEntity from "./UniqueStringEntity";
import CategoryRow from "../rows/CategoryRow";

class Category extends UniqueStringEntity {

    public static readonly NULL: Category = new Category(0, "");

    public static ofRow(row: CategoryRow): Category {
        return new Category(row.id, row.name);
    }

    public static idWrapper(id: number): Category {
        return new Category(id, "");
    }
}

export default Category;
