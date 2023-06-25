import Fetcher from "../Fetcher";
import HTTPMethod from "../../enums/HTTPMethod";
import Category from "../../entities/Category";

class ReadCategoriesFetcher extends Fetcher<Category[]> {

    private static readonly URL: string = "/records/categories";

    public constructor() {
        super(ReadCategoriesFetcher.URL, HTTPMethod.GET);
    }
}

export default ReadCategoriesFetcher;
