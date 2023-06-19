import React from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import RecordTableHeader from "./RecordTableHeader";
import Record from "../../../objects/entities/Record"
import RecordsTableRow from "./RecordsTableRow";
import GeneralPlaceholder from "../../misc/GeneralPlaceholder";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import RecordType from "../../../objects/enums/RecordType";
import Category from "../../../objects/entities/Category";
import Place from "../../../objects/entities/Place";
import User from "../../../objects/entities/User";
import Workspace from "../../../objects/entities/Workspace";
import UserLevel from "../../../objects/enums/UserLevel";

interface RecordListProps {

}

interface RecordListState {
    fetching: boolean,
    screenWidth: number,
    records: Record[]
}

class RecordList extends React.Component<RecordListProps, RecordListState> {

    private static readonly SM_BREAKPOINT: number = 576;

    public state: RecordListState = {
        fetching: false,
        screenWidth: window.innerWidth,
        // records: []
        records: [
            new Record(1, RecordType.SPEND, new Date(), "Descripción prueba", 100,
                "12345", true, new Category(1, "Alimentación"), new Place(1, "Mercadona"),
                new User(1, "Eric", "", "", UserLevel.ANONYMOUS), Workspace.NULL),
            new Record(1, RecordType.SPEND, new Date(), "Descripción prueba", 100,
                "12345", false, new Category(1, "Alimentación"), new Place(1, "Mercadona"),
                new User(1, "Eric", "", "", UserLevel.ANONYMOUS), Workspace.NULL),
            new Record(1, RecordType.SPEND, new Date(), "Descripción prueba", 100,
                "12345", true, new Category(1, "Alimentación"), new Place(1, "Mercadona"),
                new User(1, "Eric", "", "", UserLevel.ANONYMOUS), Workspace.NULL)
        ]
    }

    public constructor(props: RecordListProps | Readonly<RecordListProps>) {
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

    private renderList(): React.ReactNode {
        return <>Paso a mostrar lista</>;
    }

    // type TINYINT NOT NULL DEFAULT 1, /* 1 = spend, 2 = earn */
    // date DATE NOT NULL,
    // description VARCHAR(100) DEFAULT NULL,
    // amount DECIMAL(8, 2) DEFAULT 0.0,
    // reference VARCHAR(50),
    // shared BOOLEAN DEFAULT TRUE,
    // category INT NOT NULL,
    // place INT NOT NULL DEFAULT 1,
    // user INT NOT NULL

    private renderTable(): React.ReactNode {
        return (
            <Table striped hover responsive>
                <RecordTableHeader />
                <tbody>
                {this.state.records.map(record =>
                    <RecordsTableRow key={record.id} record={record} />
                )}
                </tbody>
            </Table>
        );
    }

    private renderRecords(): React.ReactNode {
        if(this.state.records.length === 0) {
            return (<Alert variant="info">Todavía no has añadido registros a este espacio.</Alert>);
        }
        if(this.state.screenWidth < RecordList.SM_BREAKPOINT) {
            return this.renderList();
        }
        return this.renderTable();
    }

    public render(): React.ReactNode {
        if(this.state.fetching) {
            return <GeneralPlaceholder />
        }
        return (<>
            <Container fluid className="mb-3 d-flex justify-content-center">
                <Button variant="outline-primary">Añadir movimiento(s)</Button>
            </Container>
            {this.renderRecords()}
        </>);
    }
}

export default RecordList;
