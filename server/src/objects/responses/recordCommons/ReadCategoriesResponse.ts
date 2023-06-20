import JSONResponse from "../JSONResponse";
import Category from "../../entities/Category";

class ReadCategoriesResponse extends JSONResponse<Category[]> {

    public static NONE: ReadCategoriesResponse = new ReadCategoriesResponse(false, []);

    public constructor(success: boolean, places: Category[] = []) {
        super(success, places);
    }
}

export default ReadCategoriesResponse;
