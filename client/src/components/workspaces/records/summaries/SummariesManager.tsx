import React from "react";
import Form from "react-bootstrap/Form";
import Accordion from "react-bootstrap/Accordion";
import Record from "../../../../objects/entities/Record";
import RecordRenderer from "../RecordRenderer";
import Workspace from "../../../../objects/entities/Workspace";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import DateFromIcon from "../../../../images/DateFromSvg";
import DateToIcon from "../../../../images/DateToSvg";
import User from "../../../../objects/entities/User";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ReadWorkspaceUsersFetcher from "../../../../objects/fetchers/workspaces/users/ReadWorkspaceUsersFetcher";
import OptionalTextAlert from "../../../misc/OptionalTextAlert";
import FilterRecordsFetcher, {
    FilterRecordsResponse
} from "../../../../objects/fetchers/workspaces/records/FilterRecordsFetcher";
import MakeSummaryFetcher, {
    MakeSummaryResponse
} from "../../../../objects/fetchers/workspaces/records/MakeSummaryFetcher";
import SummaryData from "../../../../objects/entities/SummaryData";
import Summary from "./Summary";

interface SummariesManagerProps {
    userId: number,
    workspace: Workspace,
    showRecordsAsList: boolean
}

interface SummariesManagerState {
    fetching: boolean
    records: Record[],
    users: User[],
    summaryData: SummaryData[],
    dateFrom: string,
    dateFromError: string,
    dateTo: string,
    dateToError: string,
    summarizeByUser: boolean,
    user: number,
    formError: string
}

class SummariesManager extends React.Component<SummariesManagerProps, SummariesManagerState> {

    public state: SummariesManagerState = {
        fetching: true,
        records: [],
        users: [],
        summaryData: [],
        dateFrom: "",
        dateFromError: "",
        dateTo: "",
        dateToError: "",
        summarizeByUser: false,
        user: this.props.userId,
        formError: ""
    };

    private radioCommon: HTMLElement | null;
    private radioSingle: HTMLElement | null;

    public constructor(props: Readonly<SummariesManagerProps> | SummariesManagerProps) {
        super(props);
        this.radioCommon = null;
        this.radioSingle = null;
    }

    public async componentDidMount(): Promise<void> {
        this.radioCommon = document.getElementById("opt-common");
        this.radioCommon?.setAttribute("checked", "true");
        this.radioCommon?.addEventListener("click", () => this.radioCommonClicked());
        this.radioSingle = document.getElementById("opt-single");
        this.radioSingle?.addEventListener("click", () => this.radioSingleClicked());
        await this.reloadUsers();
    }

    public componentWillUnmount(): void {
        this.radioCommon?.removeEventListener("click", () => this.radioCommonClicked());
        this.radioSingle?.removeEventListener("click", () => this.radioSingleClicked());
    }

    private radioCommonClicked(): void {
        this.setState({summarizeByUser: false})
    }

    private radioSingleClicked(): void {
        this.setState({summarizeByUser: true})
    }

    private async reloadUsers(newUserId: number = this.props.userId): Promise<boolean> {
        let fetcher: ReadWorkspaceUsersFetcher = new ReadWorkspaceUsersFetcher(this.props.workspace.id);
        if(!await fetcher.retrieveData()) {
            this.setState({
                fetching: false,
                formError: "Error en la conexión al servidor"
            });
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
            fetching: false,
            users: responseData,
            user: markedUser
        });
        return fetcher.success();
    }

    private async getRecordFilteredList(): Promise<boolean> {
        let fetcher: FilterRecordsFetcher = new FilterRecordsFetcher(
            this.props.workspace.id,
            this.state.dateFrom,
            this.state.dateTo,
            this.state.summarizeByUser,
            this.state.user
        );
        if(!await fetcher.retrieveData()) {
            return false;
        }
        let responseData: FilterRecordsResponse = fetcher.getResponseData();
        if(!fetcher.success()) {
            return false;
        }
        this.setState({
            dateFromError: responseData.dateFrom,
            dateToError: responseData.dateTo,
            formError: responseData.global,
            records: responseData.records
        })
        return fetcher.success();
    }

    private async getSummary(): Promise<boolean> {
        let fetcher: MakeSummaryFetcher = new MakeSummaryFetcher(
            this.props.workspace.id,
            this.state.dateFrom,
            this.state.dateTo,
            this.state.summarizeByUser,
            this.state.user
        );
        if(!await fetcher.retrieveData()) {
            return false;
        }
        let responseData: MakeSummaryResponse = fetcher.getResponseData();
        if(!fetcher.success()) {
            return false;
        }
        this.setState({
            dateFromError: responseData.dateFrom,
            dateToError: responseData.dateTo,
            formError: responseData.global,
            summaryData: responseData.summaryData
        });
        return fetcher.success();
    }

    private async calculate(): Promise<void> {
        this.setState({fetching: true});
        let promises: Promise<boolean>[] = [
            this.getRecordFilteredList(),
            this.getSummary()
        ];
        return Promise.allSettled(promises)
            .then(results => {
                let errors: boolean = results.some(result => !result);
                this.setState({
                    fetching: false,
                    formError: (errors ? "Error en la solicitud al servidor" : "")
                });
            });
    }

    public render(): React.ReactNode {
        return (<>
            <Accordion defaultActiveKey={["form", "summary", "records"]} alwaysOpen>
                <Accordion.Item eventKey="form">
                    <Accordion.Header>
                        <span className="fw-bold">Filtros de selección</span>
                    </Accordion.Header>
                    <Accordion.Body>
                        <Form className="mx-auto max-width-75nbp-lg">
                            <OptionalTextAlert text={this.state.formError} />
                            <Row>
                                <Col md={6} className="px-4 d-flex flex-column justify-content-start">
                                    <div className="h5 text-center mb-4">Intervalo de fechas (opcional)</div>
                                    <Form.Group className="mb-3" controlId="date-from">
                                        <Form.Label>Desde</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text id="date-from">
                                                <DateFromIcon />
                                            </InputGroup.Text>
                                            <Form.Control type="date" placeholder="dd/mm/aaaa" aria-describedby="date-start" value={this.state.dateFrom}
                                                          onChange={event => this.setState({dateFrom: event.target.value})} />
                                        </InputGroup>
                                        <Form.Text className="text-danger">{this.state.dateFromError}</Form.Text>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="date-from">
                                        <Form.Label>Hasta</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text id="date-from">
                                                <DateToIcon />
                                            </InputGroup.Text>
                                            <Form.Control type="date" placeholder="dd/mm/aaaa" aria-describedby="date-start" value={this.state.dateTo}
                                                          onChange={event => this.setState({dateTo: event.target.value})} />
                                        </InputGroup>
                                        <Form.Text className="text-danger">{this.state.dateToError}</Form.Text>
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="px-4 d-flex flex-column justify-content-between align-items-center">
                                    <div className="h5 text-center mb-4">Opciones de resumen</div>
                                    <Form.Check type="radio" name="report-type" id="opt-common"
                                                label="Gastos comunes a todos los usuarios del espacio"/>
                                    <Form.Check type="radio" name="report-type" id="opt-single" disabled={this.state.users.length === 0}
                                                label="Gastos e ingresos individuales de un usuario" />
                                    <Container fluid className="my-3 d-flex justify-content-start">
                                        <Button variant="secondary" disabled className="text-dark bg-secondary bg-opacity-25">
                                            <FontAwesomeIcon icon={["fas", "user"]} size="1x" />
                                        </Button>
                                        <Form.Select disabled={!this.state.summarizeByUser || this.state.users.length === 0} value={this.state.user}
                                                     onChange={event => this.setState({user: parseInt(event.target.value)})}>
                                            {this.state.users.map(user =>
                                                <option key={user.id} value={user.id}>{user.name}</option>
                                            )}
                                        </Form.Select>
                                    </Container>
                                </Col>
                            </Row>
                            <Container fluid className="mt-4 mb-2 d-flex justify-content-center">
                                <Button variant="outline-primary" disabled={this.state.fetching}
                                    onClick={() => this.calculate()}>Calcular</Button>
                            </Container>
                        </Form>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="summary">
                    <Accordion.Header>
                        <span className="fw-bold">Resumen</span>
                    </Accordion.Header>
                    <Accordion.Body>
                        <Summary summaryData={this.state.summaryData} />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="records">
                    <Accordion.Header>
                        <span className="fw-bold">Movimientos</span>
                    </Accordion.Header>
                    <Accordion.Body>
                        <RecordRenderer records={this.state.records} showList={this.props.showRecordsAsList}
                                        noRecordsMsg="No se han encontrado movimientos con las características solicitadas" />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </>);
    }
}

export default SummariesManager;
