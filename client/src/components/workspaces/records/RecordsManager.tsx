import React from "react";
import Container from "react-bootstrap/Container";
import Record from "../../../objects/entities/Record"
import GeneralPlaceholder from "../../misc/GeneralPlaceholder";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import RecordType from "../../../objects/enums/RecordType";
import Category from "../../../objects/entities/Category";
import Place from "../../../objects/entities/Place";
import User from "../../../objects/entities/User";
import Workspace from "../../../objects/entities/Workspace";
import UserLevel from "../../../objects/enums/UserLevel";
import RecordsTable from "./RecordsTable";
import RecordsList from "./RecordsList";
import {LinkContainer} from "react-router-bootstrap";

interface RecordsManagerProps {
    workspace: Workspace
}

interface RecordsManagerState {
    fetching: boolean,
    screenWidth: number,
    records: Record[]
}

class RecordsManager extends React.Component<RecordsManagerProps, RecordsManagerState> {

    private static readonly SM_BREAKPOINT: number = 576;

    public state: RecordsManagerState = {
        fetching: false,
        screenWidth: window.innerWidth,
        // records: []
        records: [
            new Record(1, RecordType.SPEND, new Date(), "Descripción prueba", 100,
                "12345", true, new Category(1, "Alimentación"), new Place(1, "Mercadona"),
                new User(1, "Eric", "", "", UserLevel.ANONYMOUS), Workspace.NULL),
            new Record(1, RecordType.EARN, new Date(), "Descripción prueba", 100,
                "12345", false, new Category(1, "Alimentación"), new Place(1, "Mercadona"),
                new User(1, "Eric", "", "", UserLevel.ANONYMOUS), Workspace.NULL),
            new Record(1, RecordType.SPEND, new Date(), "Descripción prueba", 100,
                "12345", true, new Category(1, "Alimentación"), new Place(1, "Mercadona"),
                new User(1, "Eric", "", "", UserLevel.ANONYMOUS), Workspace.NULL)
        ]
    }

    public constructor(props: RecordsManagerProps | Readonly<RecordsManagerProps>) {
        super(props);
    }

    public componentDidMount(): void {
        window.addEventListener("resize", this.readScreenWidth.bind(this));
    }

    public componentWillUnmount(): void {
        window.removeEventListener("resize", this.readScreenWidth.bind(this));
    }

    private readScreenWidth(): void {
        this.setState({screenWidth: window.innerWidth});
    }

    private renderRecords(): React.ReactNode {
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
                    <Button variant="outline-primary">Añadir movimiento(s)</Button>
                </LinkContainer>
            </Container>
            {this.renderRecords()}
        </>);
    }
}

export default RecordsManager;
