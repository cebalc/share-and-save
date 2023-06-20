import UniqueStringEntity from "./UniqueStringEntity";

class Category extends UniqueStringEntity {
    public static readonly NULL: Category = new Category(0, "");
}

export default Category;
