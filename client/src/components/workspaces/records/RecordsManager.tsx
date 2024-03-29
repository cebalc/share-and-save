import React from "react";
import Container from "react-bootstrap/Container";
import Record from "../../../objects/entities/Record"
import GeneralPlaceholder from "../../misc/GeneralPlaceholder";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Workspace from "../../../objects/entities/Workspace";
import {LinkContainer} from "react-router-bootstrap";
import ReadRecordFetcher from "../../../objects/fetchers/workspaces/records/ReadRecordFetcher";
import {scrollIntoHTMLElement} from "../../../modules/misc";
import RecordRenderer from "./RecordRenderer";

interface RecordsManagerProps {
    workspace: Workspace
    showRecordsAsList: boolean
}

interface RecordsManagerState {
    fetching: boolean,
    fetchError: boolean,
    //screenWidth: number,
    records: Record[]
}

class RecordsManager extends React.Component<RecordsManagerProps, RecordsManagerState> {

    //private static readonly SM_BREAKPOINT: number = 576;

    public state: RecordsManagerState = {
        fetching: true,
        fetchError: false,
        //screenWidth: window.innerWidth,
        records: []
    }

    public constructor(props: RecordsManagerProps | Readonly<RecordsManagerProps>) {
        super(props);
    }

    public async componentDidMount(): Promise<void> {
        await this.retrieveRecords()
            .then(() => {
                let searchParams: URLSearchParams = new URLSearchParams(window.location.search);
                if(searchParams.has("saved") && searchParams.has("r")) {
                    scrollIntoHTMLElement(`r-${searchParams.get("r")}`)
                }
            });
    }

    private async retrieveRecords(): Promise<void> {
        let fetcher: ReadRecordFetcher = new ReadRecordFetcher(this.props.workspace.id);
        if(!await fetcher.retrieveData()) {
            this.setState({
                fetching: false,
                fetchError: true
            });
            return;
        }
        let responseData: Record[] = fetcher.getResponseData();
        this.setState({
            fetching: false,
            records: responseData,
            fetchError: !fetcher.success()
        });
    }

    private renderRecords(): React.ReactNode {
        if(this.state.fetchError) {
            return <Alert variant="danger">Error al recuperar los movimientos</Alert>
        }
        return <RecordRenderer records={this.state.records} showList={this.props.showRecordsAsList}
                   noRecordsMsg="Todavía no has añadido registros a este espacio." />
    }

    public render(): React.ReactNode {
        if(this.state.fetching) {
            return <GeneralPlaceholder />
        }
        return (<>
            <Container fluid className="mb-3 d-flex justify-content-center">
                <LinkContainer to={`/workspace/${this.props.workspace.id}/records/create`}>
                    <Button variant="outline-primary">Añadir movimiento</Button>
                </LinkContainer>
            </Container>
            {this.renderRecords()}
        </>);
    }
}

export default RecordsManager;
