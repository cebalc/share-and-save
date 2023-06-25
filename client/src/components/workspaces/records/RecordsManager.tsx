import React from "react";
import Container from "react-bootstrap/Container";
import Record from "../../../objects/entities/Record"
import GeneralPlaceholder from "../../misc/GeneralPlaceholder";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
// import RecordType from "../../../objects/enums/RecordType";
// import Category from "../../../objects/entities/Category";
// import Place from "../../../objects/entities/Place";
// import User from "../../../objects/entities/User";
import Workspace from "../../../objects/entities/Workspace";
// import UserLevel from "../../../objects/enums/UserLevel";
import RecordsTable from "./RecordsTable";
import RecordsList from "./RecordsList";
import {LinkContainer} from "react-router-bootstrap";
import ReadRecordsFetcher from "../../../objects/fetchers/workspaces/records/ReadRecordsFetcher";
import {scrollIntoHTMLElement} from "../../../modules/misc";

interface RecordsManagerProps {
    workspace: Workspace
}

interface RecordsManagerState {
    fetching: boolean,
    fetchError: boolean,
    screenWidth: number,
    records: Record[]
}

class RecordsManager extends React.Component<RecordsManagerProps, RecordsManagerState> {

    private static readonly SM_BREAKPOINT: number = 576;

    public state: RecordsManagerState = {
        fetching: true,
        fetchError: false,
        screenWidth: window.innerWidth,
        records: []
    }

    public constructor(props: RecordsManagerProps | Readonly<RecordsManagerProps>) {
        super(props);
    }

    public async componentDidMount(): Promise<void> {
        window.addEventListener("resize", this.readScreenWidth.bind(this));
        await this.retrieveRecords()
            .then(() => {
                let searchParams: URLSearchParams = new URLSearchParams(window.location.search);
                if(searchParams.has("created") && searchParams.has("r")) {
                    scrollIntoHTMLElement(`r-${searchParams.get("r")}`)
                }
            });
    }

    public componentWillUnmount(): void {
        window.removeEventListener("resize", this.readScreenWidth.bind(this));
    }

    private async retrieveRecords(): Promise<void> {
        let fetcher: ReadRecordsFetcher = new ReadRecordsFetcher(this.props.workspace.id);
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

    private readScreenWidth(): void {
        this.setState({screenWidth: window.innerWidth});
    }

    private renderRecords(): React.ReactNode {
        if(this.state.fetchError) {
            return <Alert variant="danger">Error al recuperar los movimientos</Alert>
        }
        if(this.state.records.length === 0) {
            return (<Alert variant="info">Todavía no has añadido registros a este espacio.</Alert>);
        }
        if(this.state.screenWidth < RecordsManager.SM_BREAKPOINT) {
            return <RecordsList records={this.state.records} />;
        }
        return <RecordsTable records={this.state.records} />;
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
