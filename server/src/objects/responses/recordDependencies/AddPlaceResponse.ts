import JSONResponse from "../JSONResponse";

interface IAddPlaceResponse {
    name: string,
    global: string,
    id: number
}

class AddPlaceResponse extends JSONResponse<IAddPlaceResponse> {

    public static readonly NAME_EXISTS: AddPlaceResponse = new AddPlaceResponse(
        false, "El nombre introducido ya existe. Escoge otro");
    public static readonly NOT_ADDED: AddPlaceResponse = new AddPlaceResponse(
        false, "", "No ha podido añadirse el establecimiento. Inténtalo de nuevo");

    public static success(newPlaceId: number): AddPlaceResponse {
        return new AddPlaceResponse(true, "", "", newPlaceId);
    }

    public constructor(success: boolean, name: string = "", global: string = "", id= 0) {
        super(success, <IAddPlaceResponse>{name, global, id});
    }
}

export default AddPlaceResponse;
