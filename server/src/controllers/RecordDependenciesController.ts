import ServerController from "./ServerController";
import {Result, ValidationChain, ValidationError, validationResult} from "express-validator";
import { Request, Response, NextFunction } from "express";
import FilterFactory from "../objects/filters/FilterFactory";
import AddPlaceResponse from "../objects/responses/recordCommons/AddPlaceResponse";
import RecordDependenciesModel from "../models/RecordDependenciesModel";
import Place from "../objects/entities/Place";
import ReadPlacesResponse from "../objects/responses/recordCommons/ReadPlacesResponse";
import Category from "../objects/entities/Category";
import ReadCategoriesResponse from "../objects/responses/recordCommons/ReadCategoriesResponse";

class RecordDependenciesController extends ServerController<RecordDependenciesModel> {

    public addPlaceFilters(): ValidationChain {
        return FilterFactory.placeName();
    }

    public async addPlace(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            let errors: Result<ValidationError> = validationResult(request);
            if(!errors.isEmpty()) {
                let errorsObject: Record<string, ValidationError> = errors.mapped();
                response.json(new AddPlaceResponse(false,
                    errorsObject.name !== undefined ? errorsObject.name.msg : ""
                ));
                return;
            }

            let name: string = request.body.name;
            this.model = new RecordDependenciesModel();

            let placeExists: boolean = await this.model.placeNameExists(name);
            if(placeExists) {
                this.model.delete();
                response.json(AddPlaceResponse.NAME_EXISTS);
            }

            let newPlace: Place = await this.model.createPlace(name);
            this.model.delete();
            if(newPlace == null) {
                response.json(AddPlaceResponse.NOT_ADDED);
                return;
            }
            response.json(AddPlaceResponse.success(newPlace.id));
        } catch (error) {
            return next(error);
        }
    }

    public async getAllPlaces(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            this.model = new RecordDependenciesModel();
            let places: Place[] = await this.model.getAllPlaces();
            this.model.delete();

            if(places == null) {
                response.json(ReadPlacesResponse.NONE);
                return;
            }
            response.json(new ReadPlacesResponse(true, places));
        } catch (error) {
            return next(error);
        }
    }

    public async getAllCategories(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            this.model = new RecordDependenciesModel();
            let categories: Category[] = await this.model.getAllCategories();
            this.model.delete();

            if(categories == null) {
                response.json(ReadCategoriesResponse.NONE);
                return;
            }
            response.json(new ReadPlacesResponse(true, categories));
        } catch (error) {
            return next(error);
        }
    }
}

export default RecordDependenciesController;
