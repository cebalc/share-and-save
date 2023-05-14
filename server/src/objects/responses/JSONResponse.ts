abstract class JSONResponse<T> {
    public readonly success: boolean;
    public readonly data: T;

    public constructor(success: boolean, data: T) {
        this.success = success;
        this.data = data;
    }
}

export default JSONResponse;
