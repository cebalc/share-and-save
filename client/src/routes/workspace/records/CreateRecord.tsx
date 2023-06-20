import React from "react";
import Workspace from "../../../objects/entities/Workspace";
import User from "../../../objects/entities/User";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Record from "../../../objects/entities/Record"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {LinkContainer} from "react-router-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import RecordType from "../../../objects/enums/RecordType";
import Category from "../../../objects/entities/Category";
import Place from "../../../objects/entities/Place";
import AddPlaceModalForm from "../../../components/workspaces/records/AddPlaceModalForm";
import ReadPlacesFetcher from "../../../objects/fetchers/workspaces/records/ReadPlacesFetcher";
import ReadCategoriesFetcher from "../../../objects/fetchers/workspaces/records/ReadCategoriesFetcher";
import ReadWorkspaceUsersFetcher from "../../../objects/fetchers/workspaces/users/ReadWorkspaceUsersFetcher";
import OptionalTextAlert from "../../../components/misc/OptionalTextAlert";
import AddRecordFetcher, {AddRecordResponse} from "../../../objects/fetchers/workspaces/records/AddRecordFetcher";
import {Navigate} from "react-router-dom";

interface CreateRecordProps {
    userId: number,
    workspace: Workspace,
}

interface CreateRecordState {
    fetching: boolean,
    createdId: number,
    workspaceUsers: User[],
    categories: Category[],
    places: Place[],
    type: number,
    date: string,
    dateError: string,
    description: string,
    descriptionError: string,
    amount: number,
    amountError: string,
    user: number,
    shared: boolean,
    category: number,
    place: number,
    reference: string,
    referenceError: string,
    formError: string
}

class CreateRecord extends React.Component<CreateRecordProps, CreateRecordState> {

    public state: CreateRecordState = {
        fetching: true,
        createdId: Record.NEW.id,
        workspaceUsers: [],
        categories: [],
        places: [],
        type: RecordType.SPEND.id,
        date: "",
        dateError: "",
        description: "",
        descriptionError: "",
        amount: 0.0,
        amountError: "",
        user: User.GUEST.id,
        shared: true,
        category: Category.NULL.id,
        place: Place.NULL.id,
        reference: "",
        referenceError: "",
        formError: ""
    };

    private addPlaceForm: React.RefObject<AddPlaceModalForm>;

    public constructor(props: CreateRecordProps | Readonly<CreateRecordProps>) {
        super(props);
        this.addPlaceForm = React.createRef();
    }

    public async componentDidMount(): Promise<void> {
        this.setState({fetching: true});
        await this.reloadSelectControlsData();
    }

    private async reloadUsers(newUserId: number = User.GUEST.id): Promise<boolean> {
        let fetcher: ReadWorkspaceUsersFetcher = new ReadWorkspaceUsersFetcher(this.props.workspace.id);
        if(!await fetcher.retrieveData()) {
            return false;
        }
        let responseData: User[] = fetcher.getResponseData();
        let markedUser: number = User.GUEST.id;
        if(responseData.length > 0 && responseData.some(user => user.id === this.props.userId)) {
            markedUser = this.props.userId;
            if(responseData.some(user => user.id === newUserId)) {
                markedUser = newUserId;
            }
        }
        this.setState({
            workspaceUsers: responseData,
            user: markedUser
        });
        return fetcher.success();
    }

    private async reloadCategories(newCategoryId: number = this.state.category): Promise<boolean> {
        let fetcher: ReadCategoriesFetcher = new ReadCategoriesFetcher();
        if(!await fetcher.retrieveData()) {
            return false;
        }
        let responseData: Category[] = fetcher.getResponseData();
        let markedCategory: number = Category.NULL.id;
        if(responseData.length > 0) {
            markedCategory = responseData[0].id;
            if(responseData.some(category => category.id === newCategoryId)) {
                markedCategory = this.state.category;
            }
        }
        this.setState({
            categories: responseData,
            category: markedCategory
        });
        return fetcher.success();
    }

    private async reloadPlaces(newPlaceId: number = this.state.place): Promise<boolean> {
        let placesFetcher: ReadPlacesFetcher = new ReadPlacesFetcher();
        if(!await placesFetcher.retrieveData()) {
            return false;
        }
        let responseData: Place[] = placesFetcher.getResponseData();
        let markedPlace: number = Place.NULL.id;
        if(responseData.length > 0) {
            markedPlace = responseData[0].id;
            if(responseData.some(place => place.id === newPlaceId)) {
                markedPlace = this.state.place;
            }
        }
        this.setState({
            places: responseData,
            place: markedPlace
        });
        return placesFetcher.success();
    }

    private async reloadSelectControlsData(
        newUserId: number = this.state.user,
        newCategoryId: number = this.state.category,
        newPlaceId: number = this.state.place
    ): Promise<void> {
        let promises: Promise<boolean>[] = [
            this.reloadUsers(newUserId),
            this.reloadCategories(newCategoryId),
            this.reloadPlaces(newPlaceId)
        ];
        return Promise.allSettled(promises)
            .then(() => this.setState({fetching: false}));
    }

    private async updatePlaceSelector(newPlaceId: number): Promise<void> {
        this.setState({fetching: true});
        await this.reloadPlaces(newPlaceId)
            .then(() => this.setState({fetching: false}));
    }

    private showAddPlaceModalForm(): void {
        this.addPlaceForm.current?.setState({show: true});
    }

    private async createRecord(): Promise<void> {
        this.setState({fetching: true});
        await this.processCreateRequest();
    }

    private async processCreateRequest(): Promise<void> {
        let fetcher: AddRecordFetcher = new AddRecordFetcher(
            this.props.workspace.id,
            this.state.type,
            this.state.date,
            this.state.description,
            this.state.amount,
            this.state.user,
            this.state.shared,
            this.state.category,
            this.state.place,
            this.state.reference
        );
        if(!await fetcher.retrieveData()) {
            this.setState({
                formError: "Error en la conexión al servidor",
                fetching: false})
            return;
        }
        let responseData: AddRecordResponse = fetcher.getResponseData();
        this.setState({
            fetching: false,
            dateError: responseData.date,
            descriptionError: responseData.description,
            amountError: responseData.amount,
            referenceError: responseData.reference,
            formError: responseData.global,
            createdId: responseData.id
        });
    }

    private redirectIfCreated(): React.ReactNode {
        if(this.state.createdId !== Record.NEW.id) {
            return <Navigate to={`/workspace/${this.props.workspace.id}/records?r=${this.state.createdId}&created`} />;
        }
    }

    public render(): React.ReactNode {
        return (<>
            {this.redirectIfCreated()}
            <p className="h1 text-center mb-4">Añadir movimiento</p>
            <Form className="max-width-50nbp-sm mx-auto">
                <OptionalTextAlert text={this.state.formError} />
                <Row>
                    <Col sm={6} className="mb-3 d-flex justify-content-start align-items-start">
                        <Button variant="secondary" disabled className="text-dark bg-secondary bg-opacity-25">
                            <FontAwesomeIcon icon={["fas", "plus-minus"]} size="1x" />
                        </Button>
                        <Form.Select defaultValue={RecordType.SPEND.id}
                                     onChange={event => this.setState({type: parseInt(event.target.value)})}>
                            {RecordType.values().map(type =>
                                <option key={type.id} value={type.id}>{type.label}</option>
                            )}
                        </Form.Select>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-3" controlId="date">
                            <InputGroup>
                                <InputGroup.Text id="date">
                                    <FontAwesomeIcon icon={["fas", "calendar-days"]} size="1x" />
                                </InputGroup.Text>
                                <Form.Control type="date" placeholder="dd/mm/aaaa" aria-describedby="date"
                                              onChange={event => this.setState({date: event.target.value})} />
                            </InputGroup>
                            <Form.Text className="text-danger">{this.state.dateError}</Form.Text>
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group className="mb-3" controlId="description">
                    <InputGroup>
                        <InputGroup.Text id="description">
                            <FontAwesomeIcon icon={["fas", "align-left"]} size="1x" />
                        </InputGroup.Text>
                        <Form.Control placeholder="Descripción" aria-describedby="description"
                                      onChange={event => this.setState({description: event.target.value})} />
                    </InputGroup>
                    <Form.Text className="text-danger">{this.state.descriptionError}</Form.Text>
                </Form.Group>
                <Row>
                    <Col md={5}>
                        <Form.Group className="mb-3" controlId="amount">
                            <InputGroup>
                                <InputGroup.Text id="amount">
                                    <FontAwesomeIcon icon={["fas", "coins"]} size="1x" />
                                </InputGroup.Text>
                                <Form.Control type="number" placeholder="Cantidad (€)" aria-describedby="amount"
                                              onChange={event => this.setState({amount: parseFloat(event.target.value)})} />
                            </InputGroup>
                            <Form.Text className="text-danger">{this.state.amountError}</Form.Text>
                        </Form.Group>
                    </Col>
                    <Col md={7}>
                        <Row>
                            <Col sm={8} className="mb-3 d-flex justify-content-start">
                                <Button variant="secondary" disabled className="text-dark bg-secondary bg-opacity-25">
                                    <FontAwesomeIcon icon={["fas", "user"]} size="1x" />
                                </Button>
                                <Form.Select disabled={this.state.workspaceUsers.length === 0} defaultValue={this.state.user}
                                    onChange={event => this.setState({user: parseInt(event.target.value)})}>
                                    {this.state.workspaceUsers.map(user =>
                                        <option key={user.id} value={user.id}>{user.name}</option>
                                    )}
                                </Form.Select>
                            </Col>
                            <Col sm={4} className="mb-3 d-flex flex-grow-1 justify-content-end align-items-center">
                                <Button variant="secondary" disabled className="d-none d-sm-block text-dark bg-secondary bg-opacity-25">
                                    <FontAwesomeIcon icon={["fas", "users"]} size="1x" className="px-0" />
                                </Button>
                                <div className="d-flex align-items-start">
                                    <Form.Label className="d-block d-sm-none me-2">Compartido:</Form.Label>
                                    <Form.Check type="switch" id="shared" checked={this.state.shared} className="ms-1"
                                                onChange={event => this.setState({shared: event.target.checked})} />
                                </div>
                            </Col>
                        </Row>
                    </Col>

                </Row>
                <div className="w-100 mb-3 d-flex">
                    <Button variant="secondary" disabled className="text-dark bg-secondary bg-opacity-25">
                        <FontAwesomeIcon icon={["fas", "cart-shopping"]} size="1x" />
                    </Button>
                    <Form.Select disabled={this.state.categories.length === 0} defaultValue={this.state.category}
                        onChange={event => this.setState({category: parseInt(event.target.value)})}>
                        {this.state.categories.map(category =>
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        )}
                    </Form.Select>
                </div>
                <div className="w-100 mb-3 d-flex">
                    <Button variant="secondary" disabled className="text-dark bg-secondary bg-opacity-25">
                        <FontAwesomeIcon icon={["fas", "shop"]} size="1x" />
                    </Button>
                    <Form.Select disabled={this.state.places.length === 0} defaultValue={this.state.place}
                        onChange={event => this.setState({place: parseInt(event.target.value)})}>
                        {this.state.places.map(place =>
                            <option key={place.id} value={place.id}>
                                {place.name}
                            </option>
                        )}
                    </Form.Select>
                    <Button variant="outline-primary" className="ms-2" onClick={() => this.showAddPlaceModalForm()}>
                        <FontAwesomeIcon icon={["fas", "plus"]} size="1x" />
                    </Button>
                </div>
                <Form.Group className="mb-3" controlId="reference">
                    <InputGroup>
                        <InputGroup.Text id="reference">
                            <FontAwesomeIcon icon={["fas", "barcode"]} size="1x" />
                        </InputGroup.Text>
                        <Form.Control placeholder="Referencia interna" aria-describedby="reference"
                                      onChange={event => this.setState({reference: event.target.value})} />
                    </InputGroup>
                    <Form.Text className="text-danger">{this.state.referenceError}</Form.Text>
                </Form.Group>
                <Container fluid className="mx-auto mt-4 d-flex flex-row justify-content-center">
                    <Button variant="outline-primary" className="me-3" disabled={this.state.fetching}
                        onClick={() => this.createRecord()}>Enviar</Button>
                    <LinkContainer to={`/workspace/${this.props.workspace.id}/records`}>
                        <Button variant="outline-secondary">Volver</Button>
                    </LinkContainer>
                </Container>
            </Form>
            <AddPlaceModalForm ref={this.addPlaceForm} onPlaceAdded={this.updatePlaceSelector.bind(this)} />
        </>);
    }
}

export default CreateRecord;
